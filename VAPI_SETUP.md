# Vapi.ai Integration Setup Guide

This guide explains how to set up the Vapi.ai integration for your AI agent.

## Prerequisites

1. A Vapi.ai account
2. Google Calendar connected (see SETUP_CALENDAR_AND_NOTIFICATIONS.md)
3. Business Knowledge Base configured in `/dashboard/ai-agent`

## Vapi.ai Configuration

### 1. Create a Vapi.ai Assistant

1. Log in to your [Vapi.ai dashboard](https://dashboard.vapi.ai)
2. Create a new assistant
3. Configure the following settings:

### 2. System Message

The system message should include:
- Business name
- Knowledge base (Services, Prices, Hours)
- **CRITICAL**: "Detect the caller's language and respond in that language immediately"

You can use the helper function `generateVapiSystemMessage()` from `lib/vapi-config.ts` to generate this.

### 3. Function Call Configuration

Add a function call with the following configuration:

```json
{
  "name": "extract_appointment_info",
  "description": "Extract appointment information from the conversation. Call this when the customer provides their name, phone number, and desired appointment time.",
  "parameters": {
    "type": "object",
    "properties": {
      "customer_name": {
        "type": "string",
        "description": "The customer's full name"
      },
      "customer_phone": {
        "type": "string",
        "description": "The customer's phone number with country code (e.g., +1234567890)"
      },
      "desired_appointment_time": {
        "type": "string",
        "description": "The desired appointment time in ISO 8601 format (e.g., 2024-01-15T14:00:00Z)"
      },
      "language": {
        "type": "string",
        "description": "The language code detected from the conversation (e.g., en, es, fr, de)"
      }
    },
    "required": ["customer_name", "customer_phone", "desired_appointment_time", "language"]
  }
}
```

### 4. Webhook Configuration

1. In your Vapi.ai assistant settings, go to "Webhooks"
2. Set the webhook URL to: `https://yourdomain.com/api/vapi-webhook`
3. Enable webhooks for:
   - Function call events
   - Call end events

### 5. Metadata Configuration

When creating calls via Vapi.ai API, include the `business_id` in the metadata:

```javascript
{
  assistantId: "your-assistant-id",
  customer: {
    number: "+1234567890"
  },
  metadata: {
    business_id: "your-business-uuid"
  }
}
```

## How It Works

1. **Customer calls** your Vapi.ai phone number
2. **AI detects language** and responds in that language
3. **AI answers questions** using the Business Knowledge Base
4. **When customer wants appointment**, AI collects:
   - Name
   - Phone number
   - Desired appointment time
5. **AI calls function** `extract_appointment_info` with the data
6. **Webhook receives** the function call
7. **System checks** Google Calendar availability
8. **If available**:
   - Creates lead (or updates existing)
   - Creates appointment in database
   - Syncs to Google Calendar
9. **AI confirms** appointment with customer in their language

## Testing

1. Configure your Business Knowledge Base in `/dashboard/ai-agent`
2. Set up your Vapi.ai assistant with the webhook URL
3. Make a test call to your Vapi.ai number
4. Try scheduling an appointment
5. Check:
   - `/dashboard/appointments` - Should show the new appointment
   - `/dashboard/leads` - Should show the new lead
   - Google Calendar - Should show the synced event

## Troubleshooting

- **Webhook not receiving calls**: Check webhook URL is correct and publicly accessible
- **Appointments not creating**: Check webhook logs in Vapi.ai dashboard
- **Google Calendar sync failing**: Verify Google Calendar is connected in Settings
- **Language detection not working**: Ensure the system message includes the language detection instruction

## Environment Variables

Make sure these are set in your `.env.local`:

```
VAPI_API_KEY=your_vapi_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_API_KEY=your_google_api_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```
