-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- Leads Table
create table if not exists public.leads (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text,
    phone text,
    address text,
    service_needed text,
    intent text -- 'scheduling', 'info', etc.
);

-- Appointments Table
create table if not exists public.appointments (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    lead_id uuid references public.leads(id),
    date timestamp with time zone,
    status text default 'scheduled' -- 'scheduled', 'completed', 'cancelled'
);

-- Debug Logs Table (Mock Notifications & System Logs)
create table if not exists public.debug_logs (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    message_type text, -- 'sms', 'email', 'system_log'
    content text,
    metadata jsonb
);

-- Analytics Table (Simple Counter)
create table if not exists public.analytics_counters (
    id text primary key, -- e.g., 'call_volume'
    count integer default 0,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Helper to increment counter (Optional but useful)
create or replace function increment_counter(counter_id text)
returns void as $$
begin
    insert into public.analytics_counters (id, count)
    values (counter_id, 1)
    on conflict (id)
    do update set count = analytics_counters.count + 1, updated_at = now();
end;
$$ language plpgsql;

-- Enable RLS (Optional: Adjust based on your security policies)
alter table public.leads enable row level security;
alter table public.appointments enable row level security;
alter table public.debug_logs enable row level security;
alter table public.analytics_counters enable row level security;

-- Create policies (For development, allowing all public access - TIGHTEN BEFORE PROD)
create policy "Enable read access for all users" on public.leads for select using (true);
create policy "Enable insert access for all users" on public.leads for insert with check (true);

create policy "Enable read access for all users" on public.appointments for select using (true);
create policy "Enable insert access for all users" on public.appointments for insert with check (true);

create policy "Enable read access for all users" on public.debug_logs for select using (true);
create policy "Enable insert access for all users" on public.debug_logs for insert with check (true);

create policy "Enable read access for all users" on public.analytics_counters for select using (true);
create policy "Enable update access for all users" on public.analytics_counters for update using (true);
