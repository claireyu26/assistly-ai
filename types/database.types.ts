export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          name: string
          owner_id: string
          language_preference: string
          business_hours: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          language_preference?: string
          business_hours?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          language_preference?: string
          business_hours?: Json
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          business_id: string
          name: string
          phone: string
          email: string | null
          language_spoken: string
          summary_of_call: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          phone: string
          email?: string | null
          language_spoken?: string
          summary_of_call?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          phone?: string
          email?: string | null
          language_spoken?: string
          summary_of_call?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          business_id: string
          lead_id: string
          start_time: string
          end_time: string
          status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          lead_id: string
          start_time: string
          end_time: string
          status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          lead_id?: string
          start_time?: string
          end_time?: string
          status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          created_at?: string
          updated_at?: string
        }
      }
      ai_config: {
        Row: {
          id: string
          business_id: string
          prompt_template: string
          vapi_phone_number: string | null
          knowledge_base: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          prompt_template: string
          vapi_phone_number?: string | null
          knowledge_base?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          prompt_template?: string
          vapi_phone_number?: string | null
          knowledge_base?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      google_calendar_tokens: {
        Row: {
          id: string
          business_id: string
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notification_templates: {
        Row: {
          id: string
          business_id: string
          language: string
          reminder_type: '24h' | '10m'
          notification_method: 'sms' | 'email'
          subject: string | null
          body: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          language?: string
          reminder_type: '24h' | '10m'
          notification_method: 'sms' | 'email'
          subject?: string | null
          body: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          language?: string
          reminder_type?: '24h' | '10m'
          notification_method?: 'sms' | 'email'
          subject?: string | null
          body?: string
          created_at?: string
          updated_at?: string
        }
      }
      notification_log: {
        Row: {
          id: string
          appointment_id: string
          reminder_type: '24h' | '10m'
          notification_method: 'sms' | 'email'
          sent_at: string
          status: 'sent' | 'failed' | 'pending'
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          reminder_type: '24h' | '10m'
          notification_method: 'sms' | 'email'
          sent_at?: string
          status?: 'sent' | 'failed' | 'pending'
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          reminder_type?: '24h' | '10m'
          notification_method?: 'sms' | 'email'
          sent_at?: string
          status?: 'sent' | 'failed' | 'pending'
          error_message?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
