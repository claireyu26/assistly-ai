import { createServerSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

interface VapiWebhookPayload {
  message?: {
    type?: string;
    function_call?: {
      name?: string;
      parameters?: any;
    };
    transcript?: string;
  };
  call?: {
    id?: string;
    status?: string;
    endedReason?: string;
    customer?: {
      number?: string;
    };
    metadata?: {
      business_id?: string;
    };
  };
  transcript?: string;
  endTime?: string;
}

export async function POST(request: Request) {
  try {
    const payload: VapiWebhookPayload = await request.json();
    const supabase = await createServerSupabaseClient();

    console.log("Vapi webhook received:", JSON.stringify(payload, null, 2));

    // Handle function call events (when AI extracts data)
    // Vapi.ai can send function calls in different formats
    const functionCall = 
      payload.message?.function_call || 
      payload.functionCall ||
      (payload.message?.type === "function-call" ? payload.message.function_call : null);

    if (functionCall?.name === "extract_appointment_info") {
      return await handleExtractAppointmentInfo(functionCall.parameters, payload, supabase);
    }

    // Handle call end event
    if (
      payload.call?.status === "ended" || 
      payload.call?.endedReason ||
      payload.status === "ended"
    ) {
      return await handleCallEnd(payload, supabase);
    }

    // Default response for other events
    return NextResponse.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Vapi webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleExtractAppointmentInfo(
  parameters: any,
  payload: VapiWebhookPayload,
  supabase: any
) {
  try {
    const { customer_name, customer_phone, desired_appointment_time, language } = parameters || {};
    
    // Try to get business_id from various possible locations
    const businessId = 
      payload.call?.metadata?.business_id ||
      payload.call?.metadata?.businessId ||
      parameters?.business_id;

    if (!businessId) {
      console.error("Missing business_id in webhook payload");
      return NextResponse.json(
        { error: "Missing business_id" },
        { status: 400 }
      );
    }

    if (!customer_name || !customer_phone || !desired_appointment_time) {
      console.error("Missing required parameters:", { customer_name, customer_phone, desired_appointment_time });
      return NextResponse.json(
        { error: "Missing required parameters: customer_name, customer_phone, or desired_appointment_time" },
        { status: 400 }
      );
    }

    // Parse the desired appointment time
    const appointmentTime = new Date(desired_appointment_time);
    const endTime = new Date(appointmentTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration

    // Check Google Calendar availability
    const isAvailable = await checkGoogleCalendarAvailability(
      businessId,
      appointmentTime,
      endTime,
      supabase
    );

    if (!isAvailable) {
      return NextResponse.json({
        success: false,
        message: "Time slot not available",
        available: false,
      });
    }

    // Create or find lead
    let leadId: string;
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("business_id", businessId)
      .eq("phone", customer_phone)
      .single();

    if (existingLead) {
      // Update existing lead
      await supabase
        .from("leads")
        .update({
          name: customer_name,
          language_spoken: language || "en",
        })
        .eq("id", existingLead.id);
      leadId = existingLead.id;
    } else {
      // Create new lead
      const { data: newLead, error: leadError } = await supabase
        .from("leads")
        .insert({
          business_id: businessId,
          name: customer_name,
          phone: customer_phone,
          language_spoken: language || "en",
        })
        .select("id")
        .single();

      if (leadError) throw leadError;
      leadId = newLead.id;
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        business_id: businessId,
        lead_id: leadId,
        start_time: appointmentTime.toISOString(),
        end_time: endTime.toISOString(),
        status: "scheduled",
      })
      .select("id")
      .single();

    if (appointmentError) throw appointmentError;

    // Sync to Google Calendar
    await syncToGoogleCalendar(
      businessId,
      appointment.id,
      customer_name,
      appointmentTime,
      endTime,
      supabase
    );

    return NextResponse.json({
      success: true,
      appointment_id: appointment.id,
      available: true,
    });
  } catch (error) {
    console.error("Error handling appointment extraction:", error);
    return NextResponse.json(
      { error: "Failed to process appointment" },
      { status: 500 }
    );
  }
}

async function handleCallEnd(payload: VapiWebhookPayload, supabase: any) {
  // This can be used for logging or cleanup
  // The actual appointment creation happens in handleExtractAppointmentInfo
  return NextResponse.json({ success: true, message: "Call ended" });
}

async function checkGoogleCalendarAvailability(
  businessId: string,
  startTime: Date,
  endTime: Date,
  supabase: any
): Promise<boolean> {
  try {
    // Get Google Calendar token
    const { data: tokenData, error: tokenError } = await supabase
      .from("google_calendar_tokens")
      .select("access_token, refresh_token, expires_at")
      .eq("business_id", businessId)
      .single();

    if (tokenError || !tokenData) {
      console.log("No Google Calendar token found, checking local appointments only");
      // If no Google Calendar token, just check local appointments
      return await checkLocalAvailability(businessId, startTime, endTime, supabase);
    }

    // Check if token is expired and refresh if needed
    let accessToken = tokenData.access_token;
    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      accessToken = await refreshGoogleToken(tokenData.refresh_token, businessId, supabase);
    }

    // Check Google Calendar for conflicts
    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/freeBusy?key=${process.env.GOOGLE_API_KEY || ""}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: "primary" }],
        }),
      }
    );

    if (!calendarResponse.ok) {
      console.error("Google Calendar API error:", await calendarResponse.text());
      // Fallback to local check
      return await checkLocalAvailability(businessId, startTime, endTime, supabase);
    }

    const calendarData = await calendarResponse.json();
    const busy = calendarData.calendars?.primary?.busy || [];

    // Also check local appointments
    const localAvailable = await checkLocalAvailability(businessId, startTime, endTime, supabase);

    // Time slot is available if not busy in Google Calendar AND locally
    return busy.length === 0 && localAvailable;
  } catch (error) {
    console.error("Error checking Google Calendar:", error);
    // Fallback to local check
    return await checkLocalAvailability(businessId, startTime, endTime, supabase);
  }
}

async function checkLocalAvailability(
  businessId: string,
  startTime: Date,
  endTime: Date,
  supabase: any
): Promise<boolean> {
  const { data: conflictingAppointments } = await supabase
    .from("appointments")
    .select("id")
    .eq("business_id", businessId)
    .in("status", ["scheduled", "confirmed"])
    .or(
      `and(start_time.lte.${startTime.toISOString()},end_time.gt.${startTime.toISOString()}),and(start_time.lt.${endTime.toISOString()},end_time.gte.${endTime.toISOString()}),and(start_time.gte.${startTime.toISOString()},end_time.lte.${endTime.toISOString()})`
    );

  return !conflictingAppointments || conflictingAppointments.length === 0;
}

async function refreshGoogleToken(
  refreshToken: string,
  businessId: string,
  supabase: any
): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Google token");
  }

  const tokens = await response.json();
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + (tokens.expires_in || 3600));

  await supabase
    .from("google_calendar_tokens")
    .update({
      access_token: tokens.access_token,
      expires_at: expiresAt.toISOString(),
    })
    .eq("business_id", businessId);

  return tokens.access_token;
}

async function syncToGoogleCalendar(
  businessId: string,
  appointmentId: string,
  customerName: string,
  startTime: Date,
  endTime: Date,
  supabase: any
) {
  try {
    // Get Google Calendar token
    const { data: tokenData, error: tokenError } = await supabase
      .from("google_calendar_tokens")
      .select("access_token, refresh_token, expires_at")
      .eq("business_id", businessId)
      .single();

    if (tokenError || !tokenData) {
      console.log("No Google Calendar token, skipping sync");
      return;
    }

    // Check if token is expired and refresh if needed
    let accessToken = tokenData.access_token;
    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      accessToken = await refreshGoogleToken(tokenData.refresh_token, businessId, supabase);
    }

    // Get business name for event title
    const { data: business } = await supabase
      .from("businesses")
      .select("name")
      .eq("id", businessId)
      .single();

    const eventTitle = `Appointment with ${customerName}`;

    // Create Google Calendar event
    const eventResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: eventTitle,
          description: `Appointment scheduled via Assistly AI Agent`,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: "UTC",
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: "UTC",
          },
          extendedProperties: {
            private: {
              appointment_id: appointmentId,
              business_id: businessId,
            },
          },
        }),
      }
    );

    if (!eventResponse.ok) {
      const error = await eventResponse.text();
      console.error("Failed to create Google Calendar event:", error);
      // Don't throw - appointment is still created locally
    }
  } catch (error) {
    console.error("Error syncing to Google Calendar:", error);
    // Don't throw - appointment is still created locally
  }
}
