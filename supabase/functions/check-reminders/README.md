# Check Reminders Edge Function

This Supabase Edge Function scans the appointments table and sends SMS (via Twilio) and Email (via Resend) reminders at 24-hour and 10-minute intervals before appointments.

## Setup

1. Deploy the function to Supabase:
```bash
supabase functions deploy check-reminders
```

2. Set environment variables in Supabase Dashboard:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `SUPABASE_URL` (automatically set)
   - `SUPABASE_SERVICE_ROLE_KEY` (automatically set)

3. Schedule the function to run periodically (e.g., every 5 minutes):
   - Use Supabase Cron Jobs or an external scheduler
   - Or call via HTTP: `POST https://your-project.supabase.co/functions/v1/check-reminders`

## How It Works

1. Scans appointments with status "scheduled"
2. Finds appointments starting in 24 hours (±1 hour window)
3. Finds appointments starting in 10 minutes (±1 minute window)
4. Checks notification_log to avoid duplicates
5. Retrieves notification templates based on business language
6. Sends SMS via Twilio and Email via Resend
7. Logs all notifications in notification_log table

## Notification Templates

Templates are stored in the `notification_templates` table and can be customized per business and language. If no template is found, default English templates are used.

## Template Variables

- `{{appointment_date}}` - Appointment date
- `{{appointment_time}}` - Appointment start time
- `{{appointment_end_time}}` - Appointment end time
- `{{business_name}}` - Business name
