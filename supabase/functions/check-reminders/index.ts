import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") || "noreply@assistly.ai";

interface Appointment {
  id: string;
  business_id: string;
  lead_id: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  language_spoken: string;
}

interface Business {
  id: string;
  name: string;
  language_preference: string;
}

interface NotificationTemplate {
  body: string;
  subject: string | null;
}

serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

    // Find appointments that need 24-hour reminders
    const { data: appointments24h, error: error24h } = await supabase
      .from("appointments")
      .select("*, leads(*), businesses(*)")
      .eq("status", "scheduled")
      .gte("start_time", twentyFourHoursFromNow.toISOString().slice(0, 16))
      .lt("start_time", new Date(twentyFourHoursFromNow.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16));

    // Find appointments that need 10-minute reminders
    const { data: appointments10m, error: error10m } = await supabase
      .from("appointments")
      .select("*, leads(*), businesses(*)")
      .eq("status", "scheduled")
      .gte("start_time", tenMinutesFromNow.toISOString().slice(0, 16))
      .lt("start_time", new Date(tenMinutesFromNow.getTime() + 60 * 1000).toISOString().slice(0, 16));

    if (error24h || error10m) {
      throw new Error(`Database error: ${error24h?.message || error10m?.message}`);
    }

    const results = {
      sent24h: { sms: 0, email: 0 },
      sent10m: { sms: 0, email: 0 },
      errors: [] as string[],
    };

    // Process 24-hour reminders
    for (const appointment of appointments24h || []) {
      const lead = appointment.leads as Lead;
      const business = appointment.businesses as Business;

      // Check if reminder already sent
      const { data: existingLog } = await supabase
        .from("notification_log")
        .select("id")
        .eq("appointment_id", appointment.id)
        .eq("reminder_type", "24h")
        .single();

      if (existingLog) continue;

      // Get notification templates
      const templates = await getNotificationTemplates(
        supabase,
        business.id,
        lead.language_spoken || business.language_preference,
        "24h"
      );

      // Send SMS
      if (lead.phone && templates.sms) {
        try {
          const formattedBody = formatTemplate(templates.sms.body, appointment, business);
          await sendSMS(lead.phone, formattedBody);
          await logNotification(supabase, appointment.id, "24h", "sms", "sent");
          results.sent24h.sms++;
        } catch (error) {
          await logNotification(supabase, appointment.id, "24h", "sms", "failed", String(error));
          results.errors.push(`SMS 24h failed for appointment ${appointment.id}: ${error}`);
        }
      }

      // Send Email
      if (lead.email && templates.email) {
        try {
          const formattedBody = formatTemplate(templates.email.body, appointment, business);
          const formattedSubject = formatTemplate(templates.email.subject || "Appointment Reminder", appointment, business);
          await sendEmail(lead.email, formattedSubject, formattedBody);
          await logNotification(supabase, appointment.id, "24h", "email", "sent");
          results.sent24h.email++;
        } catch (error) {
          await logNotification(supabase, appointment.id, "24h", "email", "failed", String(error));
          results.errors.push(`Email 24h failed for appointment ${appointment.id}: ${error}`);
        }
      }
    }

    // Process 10-minute reminders
    for (const appointment of appointments10m || []) {
      const lead = appointment.leads as Lead;
      const business = appointment.businesses as Business;

      // Check if reminder already sent
      const { data: existingLog } = await supabase
        .from("notification_log")
        .select("id")
        .eq("appointment_id", appointment.id)
        .eq("reminder_type", "10m")
        .single();

      if (existingLog) continue;

      // Get notification templates
      const templates = await getNotificationTemplates(
        supabase,
        business.id,
        lead.language_spoken || business.language_preference,
        "10m"
      );

      // Send SMS
      if (lead.phone && templates.sms) {
        try {
          const formattedBody = formatTemplate(templates.sms.body, appointment, business);
          await sendSMS(lead.phone, formattedBody);
          await logNotification(supabase, appointment.id, "10m", "sms", "sent");
          results.sent10m.sms++;
        } catch (error) {
          await logNotification(supabase, appointment.id, "10m", "sms", "failed", String(error));
          results.errors.push(`SMS 10m failed for appointment ${appointment.id}: ${error}`);
        }
      }

      // Send Email
      if (lead.email && templates.email) {
        try {
          const formattedBody = formatTemplate(templates.email.body, appointment, business);
          const formattedSubject = formatTemplate(templates.email.subject || "Appointment Reminder", appointment, business);
          await sendEmail(lead.email, formattedSubject, formattedBody);
          await logNotification(supabase, appointment.id, "10m", "email", "sent");
          results.sent10m.email++;
        } catch (error) {
          await logNotification(supabase, appointment.id, "10m", "email", "failed", String(error));
          results.errors.push(`Email 10m failed for appointment ${appointment.id}: ${error}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function getNotificationTemplates(
  supabase: any,
  businessId: string,
  language: string,
  reminderType: "24h" | "10m"
): Promise<{ sms: NotificationTemplate | null; email: NotificationTemplate | null }> {
  // Try to get templates for the specific language
  let { data: smsTemplate } = await supabase
    .from("notification_templates")
    .select("*")
    .eq("business_id", businessId)
    .eq("language", language)
    .eq("reminder_type", reminderType)
    .eq("notification_method", "sms")
    .single();

  let { data: emailTemplate } = await supabase
    .from("notification_templates")
    .select("*")
    .eq("business_id", businessId)
    .eq("language", language)
    .eq("reminder_type", reminderType)
    .eq("notification_method", "email")
    .single();

  // Fallback to English if templates not found
  if (!smsTemplate) {
    const { data } = await supabase
      .from("notification_templates")
      .select("*")
      .eq("business_id", businessId)
      .eq("language", "en")
      .eq("reminder_type", reminderType)
      .eq("notification_method", "sms")
      .single();
    smsTemplate = data;
  }

  if (!emailTemplate) {
    const { data } = await supabase
      .from("notification_templates")
      .select("*")
      .eq("business_id", businessId)
      .eq("language", "en")
      .eq("reminder_type", reminderType)
      .eq("notification_method", "email")
      .single();
    emailTemplate = data;
  }

  // If still no templates, use defaults
  const defaultSms = getDefaultTemplate(reminderType, "sms", language);
  const defaultEmail = getDefaultTemplate(reminderType, "email", language);

  return {
    sms: smsTemplate || defaultSms,
    email: emailTemplate || defaultEmail,
  };
}

function getDefaultTemplate(
  reminderType: "24h" | "10m",
  method: "sms" | "email",
  language: string
): NotificationTemplate {
  const templates: Record<string, Record<string, Record<string, NotificationTemplate>>> = {
    en: {
      "24h": {
        sms: {
          body: "Reminder: You have an appointment tomorrow. Please confirm your attendance.",
          subject: null,
        },
        email: {
          subject: "Appointment Reminder - Tomorrow",
          body: "Hello,\n\nThis is a reminder that you have an appointment scheduled for tomorrow.\n\nPlease confirm your attendance or contact us if you need to reschedule.\n\nThank you!",
        },
      },
      "10m": {
        sms: {
          body: "Reminder: Your appointment starts in 10 minutes. See you soon!",
          subject: null,
        },
        email: {
          subject: "Appointment Starting Soon",
          body: "Hello,\n\nYour appointment is scheduled to start in 10 minutes.\n\nWe look forward to seeing you!\n\nThank you!",
        },
      },
    },
    es: {
      "24h": {
        sms: {
          body: "Recordatorio: Tiene una cita mañana. Por favor confirme su asistencia.",
          subject: null,
        },
        email: {
          subject: "Recordatorio de Cita - Mañana",
          body: "Hola,\n\nEste es un recordatorio de que tiene una cita programada para mañana.\n\nPor favor confirme su asistencia o contáctenos si necesita reprogramar.\n\n¡Gracias!",
        },
      },
      "10m": {
        sms: {
          body: "Recordatorio: Su cita comienza en 10 minutos. ¡Nos vemos pronto!",
          subject: null,
        },
        email: {
          subject: "Cita Comenzando Pronto",
          body: "Hola,\n\nSu cita está programada para comenzar en 10 minutos.\n\n¡Esperamos verte!\n\n¡Gracias!",
        },
      },
    },
  };

  return templates[language]?.[reminderType]?.[method] || templates.en[reminderType][method];
}

async function sendSMS(phone: string, body: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error("Twilio credentials not configured");
  }

  // Replace template variables
  const formattedBody = formatTemplate(body, appointment);

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
      },
      body: new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: phone,
        Body: formattedBody,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio API error: ${error}`);
  }
}

async function sendEmail(
  email: string,
  subject: string,
  body: string
) {
  if (!RESEND_API_KEY) {
    throw new Error("Resend API key not configured");
  }

  // Replace template variables
  const formattedBody = formatTemplate(body, appointment);
  const formattedSubject = formatTemplate(subject, appointment);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: email,
      subject: formattedSubject,
      text: formattedBody,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }
}

function formatTemplate(template: string, appointment: Appointment, business?: Business): string {
  const startTime = new Date(appointment.start_time);
  const endTime = new Date(appointment.end_time);

  return template
    .replace(/\{\{appointment_date\}\}/g, startTime.toLocaleDateString())
    .replace(/\{\{appointment_time\}\}/g, startTime.toLocaleTimeString())
    .replace(/\{\{appointment_end_time\}\}/g, endTime.toLocaleTimeString())
    .replace(/\{\{business_name\}\}/g, business?.name || "Your Business");
}

async function logNotification(
  supabase: any,
  appointmentId: string,
  reminderType: "24h" | "10m",
  method: "sms" | "email",
  status: "sent" | "failed",
  errorMessage?: string
) {
  await supabase.from("notification_log").insert({
    appointment_id: appointmentId,
    reminder_type: reminderType,
    notification_method: method,
    status,
    error_message: errorMessage || null,
  });
}
