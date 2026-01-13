# Calendar & Notifications Setup Guide

This guide explains how to set up Google Calendar integration and appointment reminder notifications.

## Database Setup

1. Run the migration file `supabase/migrations/002_calendar_and_notifications.sql` in your Supabase SQL Editor.

This creates:
- `google_calendar_tokens` table - Stores OAuth tokens for Google Calendar
- `notification_templates` table - Customizable notification templates per business and language
- `notification_log` table - Tracks sent notifications to avoid duplicates
- Adds `email` column to `leads` table

## Google Calendar OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if prompted
6. Set application type to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google-calendar/callback` (for development)
   - `https://yourdomain.com/api/auth/google-calendar/callback` (for production)
8. Copy the Client ID and Client Secret
9. Add them to your `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

## Twilio Setup (for SMS notifications)

1. Sign up for a [Twilio account](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number or use a trial number
4. Add to your `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

## Resend Setup (for Email notifications)

1. Sign up for a [Resend account](https://resend.com/)
2. Create an API key in the Resend dashboard
3. Verify your domain (or use the default sender for testing)
4. Add to your `.env.local`:
   ```
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

## Supabase Edge Function Setup

1. Install Supabase CLI if you haven't:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Set environment variables for the Edge Function:
   ```bash
   supabase secrets set TWILIO_ACCOUNT_SID=your_account_sid
   supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token
   supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
   supabase secrets set RESEND_API_KEY=your_resend_api_key
   supabase secrets set RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

5. Deploy the function:
   ```bash
   supabase functions deploy check-reminders
   ```

6. Schedule the function to run periodically:
   - Option 1: Use Supabase Cron Jobs (pg_cron extension)
   - Option 2: Use an external cron service (e.g., cron-job.org) to call:
     `POST https://your-project.supabase.co/functions/v1/check-reminders`
   - Option 3: Use Supabase Database Webhooks

## Notification Templates

Notification templates are customizable per business and language. They support the following variables:

- `{{appointment_date}}` - The appointment date
- `{{appointment_time}}` - The appointment start time
- `{{appointment_end_time}}` - The appointment end time
- `{{business_name}}` - The business name

### Default Templates

If no custom template is found, the system uses default English templates. You can create custom templates via the API or directly in the database:

```sql
INSERT INTO notification_templates (
  business_id,
  language,
  reminder_type,
  notification_method,
  subject,
  body
) VALUES (
  'your-business-id',
  'en',
  '24h',
  'email',
  'Appointment Reminder - Tomorrow',
  'Hello,\n\nThis is a reminder that you have an appointment scheduled for tomorrow at {{appointment_time}}.\n\nThank you!'
);
```

## How It Works

1. **Google Calendar Integration**: Users can connect their Google Calendar via OAuth. The tokens are stored securely in the database.

2. **Reminder System**: The `check-reminders` Edge Function runs periodically and:
   - Scans for appointments starting in 24 hours (±1 hour window)
   - Scans for appointments starting in 10 minutes (±1 minute window)
   - Checks if reminders have already been sent (via `notification_log`)
   - Retrieves templates based on business language preference
   - Sends SMS via Twilio and Email via Resend
   - Logs all notifications

3. **Language Support**: Templates are selected based on:
   - Lead's `language_spoken` field
   - Falls back to business `language_preference`
   - Falls back to English if no template found

## Testing

1. Create a test appointment scheduled for 24 hours from now
2. Ensure the lead has a phone number and/or email
3. Manually trigger the Edge Function or wait for the scheduled run
4. Check the `notification_log` table to see if notifications were sent
5. Verify SMS/Email were received

## Troubleshooting

- **OAuth not working**: Check redirect URIs match exactly in Google Cloud Console
- **Notifications not sending**: Check Edge Function logs in Supabase Dashboard
- **Templates not found**: Ensure templates exist for the business and language
- **Duplicate notifications**: The `notification_log` table prevents duplicates, but check the time windows
