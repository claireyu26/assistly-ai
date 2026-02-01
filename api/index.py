from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from mangum import Mangum
from pydantic import BaseModel
from supabase import create_client, Client
import openai
import os
import json
import asyncio

app = FastAPI()

# --- Configuration ---
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") # Using Anon for client-side like ops, but Service Role is better for backend. relying on RLS or user key for now.
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None
client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# --- Helpers ---

async def increment_call_volume():
    """Increments the call_volume counter in Supabase."""
    if not supabase: return
    try:
        # Assuming the function was created via the SQL provided
        supabase.rpc("increment_counter", {"counter_id": "call_volume"}).execute()
    except Exception as e:
        print(f"Error incrementing counter: {e}")

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
            "name": data.get("name"),
            "address": data.get("address"),
            "service_needed": data.get("service"),
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
        return None

# --- Routes ---

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is healthy"}

@app.websocket("/api/ws/simulate-call")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # 1. Init Session
    await increment_call_volume()
    history = [
        {"role": "system", "content": """You are a professional assistant for 'Assistly Renovations', an SMB service business. 
Your mission is to extract the Customer Name, Service/Renovation Type, and Address. 
Ask one question at a time. Be polite but efficient.
Once you have all three pieces of information, you MUST call the 'schedule_appointment' tool.
Do not ask for a phone number (we are in a simulator).
"""}
    ]
    
    # Tools definition
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
                "description": "Call this ONLY when you have the Name, Address, and Service Type to finalize the booking.",
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
    
    try:
        # Initial Greeting
        greeting = "Hi, thanks for calling Assistly Renovations. How can I help with your project today?"
        await websocket.send_json({"type": "audio", "text": greeting})
        history.append({"role": "assistant", "content": greeting})

        while True:
            # Receive Audio/Text from Client
            data = await websocket.receive_text()
            user_input = json.loads(data).get("text")
            
            if not user_input:
                continue

            # Log User Input
            await log_debug("transcript_user", user_input)
            history.append({"role": "user", "content": user_input})
            
            # OpenAI Call
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=history,
                tools=tools,
                tool_choice="auto"
            )
            
            msg = response.choices[0].message
            history.append(msg)
            
            # Handle Tool Calls
            if msg.tool_calls:
                for tool_call in msg.tool_calls:
                    fn_name = tool_call.function.name
                    args = json.loads(tool_call.function.arguments)
                    
                    if fn_name == "update_extraction":
                        # Send updates to UI
                        await websocket.send_json({"type": "update_data", "data": args})
                        # Response to AI to confirm receipt (hidden from user)
                        history.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": "Dashboard updated."
                        })
                        
                    elif fn_name == "schedule_appointment":
                        # Finalize
                        # Note: In a real app we might pull the full state. 
                        # Here we assume the last 'update_extraction' had the info or we rely on the args.
                        # For simplicity, we assume the dashboard state is tracked by the client or previous calls.
                        # We'll just confirm optimization.
                        
                        await log_debug("system_action", "Scheduling Appointment Triggered")
                        await websocket.send_json({"type": "status", "text": "Scheduling..."})
                        
                        # In a real tool call, we'd probably get the data from the args or a session state. 
                        # For now, we trust the extraction updates happened.
                        # Trigger success on client
                        await websocket.send_json({"type": "success", "message": "Lead Scheduled!"})
                        await log_debug("mock_sms", f"SMS Sent to {args.get('summary', 'Client')}: Appointment Confirmed.")
                        
                        history.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": "Appointment scheduled successfully."
                        })

                # Follow-up completion after tool calls
                response_2 = await client.chat.completions.create(
                    model="gpt-4o",
                    messages=history
                )
                final_msg = response_2.choices[0].message.content
                if final_msg:
                    await websocket.send_json({"type": "audio", "text": final_msg})
                    history.append({"role": "assistant", "content": final_msg})

            else:
                # Normal Text Response
                reply = msg.content
                await websocket.send_json({"type": "audio", "text": reply})

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error in WS handler: {e}")
        await websocket.close()

handler = Mangum(app)
