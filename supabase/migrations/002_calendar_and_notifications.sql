-- Add Google Calendar OAuth and notification templates

-- Google Calendar OAuth tokens table
CREATE TABLE google_calendar_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(business_id)
);

-- Notification templates table (customizable per business language)
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('24h', '10m')),
  notification_method VARCHAR(10) NOT NULL CHECK (notification_method IN ('sms', 'email')),
  subject TEXT, -- For email subject or SMS (can be null for SMS)
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(business_id, language, reminder_type, notification_method)
);

-- Notification log table (to track sent notifications and avoid duplicates)
CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('24h', '10m')),
  notification_method VARCHAR(10) NOT NULL CHECK (notification_method IN ('sms', 'email')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add email field to leads table for email notifications
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Create indexes
CREATE INDEX idx_google_calendar_tokens_business_id ON google_calendar_tokens(business_id);
CREATE INDEX idx_notification_templates_business_id ON notification_templates(business_id);
CREATE INDEX idx_notification_templates_language ON notification_templates(language);
CREATE INDEX idx_notification_log_appointment_id ON notification_log(appointment_id);
CREATE INDEX idx_notification_log_sent_at ON notification_log(sent_at);

-- Enable RLS
ALTER TABLE google_calendar_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for google_calendar_tokens
CREATE POLICY "Users can manage their own calendar tokens"
  ON google_calendar_tokens FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = google_calendar_tokens.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

-- RLS Policies for notification_templates
CREATE POLICY "Users can manage their own notification templates"
  ON notification_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = notification_templates.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

-- RLS Policies for notification_log
CREATE POLICY "Users can view their own notification logs"
  ON notification_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      JOIN businesses ON businesses.id = appointments.business_id
      WHERE appointments.id = notification_log.appointment_id
      AND businesses.owner_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_google_calendar_tokens_updated_at BEFORE UPDATE ON google_calendar_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default notification templates for English
-- These will be created per business when they set up notifications
-- For now, we'll create them via the application
