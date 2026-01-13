create table public.invite_codes (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  is_active boolean default true,
  max_uses int default 10,
  uses_count int default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.invite_codes enable row level security;

-- Policy: Public can read active codes (needed for the check)
-- Ideally we wrap this in a postgres function to avoid exposing the whole table, 
-- but for now allowing select on code is acceptable for the MVP if we trust the server action to handle it.
-- Actually, since we are using a Server Action with the Service Role (or just authenticated client), 
-- we might not need public access if the server action uses the service key.
-- But standard supabase client needs access.
-- Let's stick to a secure function approach or standard select policy restricted to just "code" existence.

-- Simplest MVP: Allow select for anyone (anon) so the "check" works, but maybe restrict columns?
-- Better: Use a security definer function.

create or replace function verify_invite_code(input_code text)
returns boolean
language plpgsql
security definer
as $$
declare
  valid boolean;
begin
  select exists(
    select 1 from public.invite_codes
    where code = input_code
    and is_active = true
    and uses_count < max_uses
  ) into valid;
  return valid;
end;
$$;
