/**
 * Helper functions for generating Vapi.ai configuration
 */

export interface BusinessKnowledgeBase {
  services: string;
  prices: string;
  hours: string;
}

export function generateVapiSystemMessage(
  businessName: string,
  knowledgeBase: BusinessKnowledgeBase
): string {
  return `You are a helpful AI assistant for ${businessName}.

CRITICAL: Detect the caller's language and respond in that language immediately. Do not ask what language they speak - detect it from their first words and respond accordingly.

Your role is to:
1. Answer questions about the business using the knowledge base below
2. Help customers schedule appointments
3. Be friendly, professional, and helpful

BUSINESS KNOWLEDGE BASE:

SERVICES:
${knowledgeBase.services || "No services listed"}

PRICING:
${knowledgeBase.prices || "No pricing information available"}

BUSINESS HOURS:
${knowledgeBase.hours || "No hours specified"}

When a customer wants to schedule an appointment:
1. Ask for their name and phone number
2. Ask what date and time they prefer
3. Use the function call "extract_appointment_info" with the following parameters:
   - customer_name: The customer's full name
   - customer_phone: Their phone number (include country code)
   - desired_appointment_time: ISO 8601 format (e.g., "2024-01-15T14:00:00Z")
   - language: The language code you detected (e.g., "en", "es", "fr")

4. Confirm the appointment details with the customer in their language
5. If the time is not available, suggest alternative times

Always be polite, professional, and speak in the customer's language.`;
}

export function generateVapiFunctionCall() {
  return {
    name: "extract_appointment_info",
    description:
      "Extract appointment information from the conversation. Call this when the customer provides their name, phone number, and desired appointment time.",
    parameters: {
      type: "object",
      properties: {
        customer_name: {
          type: "string",
          description: "The customer's full name",
        },
        customer_phone: {
          type: "string",
          description: "The customer's phone number with country code (e.g., +1234567890)",
        },
        desired_appointment_time: {
          type: "string",
          description: "The desired appointment time in ISO 8601 format (e.g., 2024-01-15T14:00:00Z)",
        },
        language: {
          type: "string",
          description: "The language code detected from the conversation (e.g., en, es, fr, de)",
        },
      },
      required: ["customer_name", "customer_phone", "desired_appointment_time", "language"],
    },
  };
}
