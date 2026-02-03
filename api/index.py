from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from mangum import Mangum
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from supabase import create_client, Client
import openai
import os
import json
import asyncio
import traceback

app = FastAPI()

# --- Configuration ---
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
# Use Service Role Key for backend operations to bypass RLS
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None
client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# --- Models ---
class Message(BaseModel):
    role: str
    content: Optional[str] = None # Content can be null in some tool messages
    tool_calls: Optional[List[Any]] = None
    tool_call_id: Optional[str] = None

class SimulateStepRequest(BaseModel):
    messages: List[Message]
    text: str # The latest user input

# --- Helpers ---

async def log_debug(message_type: str, content: str, metadata: dict = {}):
    """Writes to debug_logs table."""
    if not supabase: return
    try:
        supabase.table("debug_logs").insert({
            "message_type": message_type,
            "content": content,
            "metadata": metadata
        }).execute()
        print(f"Logged to DB: {message_type} - {content}")
    except Exception as e:
        print(f"Error logging debug: {e}")

async def save_lead(data: dict):
    """Saves the lead and appointment to Supabase."""
    if not supabase: return None
    try:
        # 1. Create Lead
        lead_res = supabase.table("leads").insert({
            "name": data.get("name") or "Unknown User",
            "address": data.get("address") or "Unknown Address",
            "service_needed": data.get("service") or "General Inquiry",
            "intent": "scheduling",
            "phone": "simulated_browser_user" 
        }).execute()
        
        if lead_res.data:
            lead_id = lead_res.data[0]['id']
            # 2. Create Appointment
            supabase.table("appointments").insert({
                "lead_id": lead_id,
                "status": "scheduled",
                "date": "2026-02-01T10:00:00Z" # Dummy future date for sandbox
            }).execute()
            return lead_id
    except Exception as e:
        print(f"Error saving lead: {e}")
        # Log error but don't crash
        await log_debug("db_error", f"Save Lead Failed: {str(e)}")
        return None

def recover_state_from_history(messages: List[Message]) -> dict:
    """Parses history to find the latest state from tool calls."""
    state = {}
    for msg in messages:
        if msg.role == 'assistant' and msg.tool_calls:
            for tc in msg.tool_calls:
                # tc is a dict if coming from pydantic dump, or object if from object
                # But here we are iterating Pydantic models? 
                # Pydantic models behave like objects.
                # However, the input 'messages' are Pydantic models.
                # 'tool_calls' in OpenAI is a list of objects.
                # But when deserialized from JSON in request, it's whatever Pydantic parses.
                # Let's handle it safely.
                try:
                    # If it's a dict
                    fn = tc.get('function') if isinstance(tc, dict) else tc.function
                    name = fn.get('name') if isinstance(fn, dict) else fn.name
                    args_str = fn.get('arguments') if isinstance(fn, dict) else fn.arguments
                    
                    if name == 'update_extraction':
                        args = json.loads(args_str)
                        state.update(args)
                except Exception as e:
                    pass
    return state

# --- Routes ---

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is healthy"}

@app.post("/api/simulate-step")
async def simulate_step(request: SimulateStepRequest):
    try:
        if not client:
            raise Exception("OpenAI API Key not configured")

        # 1. Prepare Tools
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "update_extraction",
                    "description": "Call this whenever you identify a new piece of information (Name, Address, or Service) to update the dashboard.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "address": {"type": "string"},
                            "service": {"type": "string"}
                        },
                        "required": []
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "schedule_appointment",
                    "description": "Call this ONLY when you have the Name, Address, and Service Type to finalize the booking. Summary is required.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "summary": {"type": "string", "description": "Summary of the job"}
                        },
                        "required": ["summary"]
                    }
                }
            }
        ]

        # 2. Recover State & Construct History
        current_state = recover_state_from_history(request.messages)
        
        system_prompt = {
            "role": "system", 
            "content": """You are a professional assistant for 'Assistly Renovations'.
Your mission is to extract the Customer Name, Service/Renovation Type, and Address. 
Ask one question at a time. Be polite but efficient.
Once you have all three pieces of information, you MUST call the 'schedule_appointment' tool.
Do not ask for a phone number.
"""
        }
        
        # Convert Pydantic models to dicts for OpenAI
        # We need to ensure the format matches what OpenAI expects.
        # request.messages are Pydantic models.
        history_dicts = []
        for m in request.messages:
            msg_dict = {"role": m.role, "content": m.content}
            if m.tool_calls:
                msg_dict["tool_calls"] = m.tool_calls
            if m.tool_call_id:
                msg_dict["tool_call_id"] = m.tool_call_id
            history_dicts.append(msg_dict)

        full_history = [system_prompt] + history_dicts
        full_history.append({"role": "user", "content": request.text})
        
        await log_debug("transcript_user", request.text)

        # 3. Call OpenAI
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=full_history,
            tools=tools,
            tool_choice="auto"
        )
        
        msg = response.choices[0].message
        
        response_data = {
            "text": msg.content,
            "extracted": {},
            "status": "interacting"
        }
        
        # 4. Handle Tools
        if msg.tool_calls:
            for tool_call in msg.tool_calls:
                fn_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)
                
                if fn_name == "update_extraction":
                    current_state.update(args)
                    response_data["extracted"] = args # Send delta to front
                    await log_debug("extraction_update", json.dumps(args))
                    
                elif fn_name == "schedule_appointment":
                    await log_debug("system_action", "Scheduling Appointment Triggered")
                    
                    # Save using recovered state + any updates
                    lead_id = await save_lead(current_state)
                    
                    response_data["status"] = "success"
                    response_data["text"] = "Great, I've scheduled that for you. Someone will be in touch shortly."
                    await log_debug("mock_sms", f"SMS Sent: Appointment Confirmed.")

            # If tool called but no content, generate follow-up
            if not msg.content:
                 history_with_tool = full_history + [msg]
                 # Add tool results to history for the follow-up generation
                 for tool_call in msg.tool_calls:
                     history_with_tool.append({
                         "role": "tool",
                         "tool_call_id": tool_call.id,
                         "content": "Success"
                     })
                 
                 response_2 = await client.chat.completions.create(
                    model="gpt-4o",
                    messages=history_with_tool
                 )
                 response_data["text"] = response_2.choices[0].message.content

        return response_data

    except Exception as e:
        tb = traceback.format_exc()
        print(f"CRITICAL ERROR: {tb}")
        await log_debug("critical_error", tb)
        # Return 200 with error info so frontend can display it in logs instead of generic 500
        return JSONResponse(status_code=200, content={
            "status": "error",
            "text": f"System Error: {str(e)}",
            "extracted": {}, 
            "traceback": tb
        })

handler = Mangum(app)

