# Assistly

AI-Driven Operating System for Small Businesses

## Core Mission

Eliminate language barriers and 24/7 admin overhead for micro-teams.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Supabase** (Postgres, Auth, Edge Functions)
- **Tailwind CSS**
- **Vapi.ai** (Voice AI)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Vapi.ai account and API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your Supabase and Vapi.ai credentials in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VAPI_API_KEY`: Your Vapi.ai API key

3. Set up the database:

Run the `schema.sql` file in your Supabase SQL Editor to create all the necessary tables. Alternatively, you can use the migration file at `supabase/migrations/001_initial_schema.sql`.

### Database Schema

The application uses the following tables:

1. **businesses**: Stores business information
   - `id`, `name`, `owner_id`, `language_preference`, `business_hours`

2. **leads**: Stores lead information from calls
   - `id`, `business_id`, `name`, `phone`, `language_spoken`, `summary_of_call`

3. **appointments**: Manages appointments
   - `id`, `business_id`, `lead_id`, `start_time`, `end_time`, `status`

4. **ai_config**: Stores AI configuration per business
   - `id`, `business_id`, `prompt_template`, `vapi_phone_number`

All tables have Row Level Security (RLS) enabled with policies that ensure users can only access their own business data.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages with sidebar layout
│   ├── auth/             # Authentication routes
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── lib/                   # Utility functions
│   ├── supabase.ts      # Main Supabase client configuration
│   ├── supabase/        # Supabase client setup (legacy)
│   └── utils.ts         # Utility functions
├── types/                # TypeScript type definitions
│   └── database.types.ts # Database types
├── supabase/             # Database migrations
│   └── migrations/       # SQL migration files
├── schema.sql            # Database schema (run in Supabase SQL Editor)
└── middleware.ts         # Next.js middleware for auth
```

## Features

- Multi-language support
- 24/7 AI voice assistant integration
- Lead management
- Appointment scheduling
- Business hours configuration
- Google Calendar integration with OAuth
- Automated appointment reminders (SMS & Email) via Twilio and Resend
- Customizable notification templates per business and language
- Secure authentication with Supabase Auth

## Additional Setup

For Google Calendar integration and appointment reminders, see [SETUP_CALENDAR_AND_NOTIFICATIONS.md](./SETUP_CALENDAR_AND_NOTIFICATIONS.md)
