-- Create guestbook table
create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.guestbook_entries enable row level security;

-- Allow anyone to read entries
create policy "guestbook_select_all"
  on public.guestbook_entries for select
  using (true);

-- Allow anyone to insert entries (public guestbook)
create policy "guestbook_insert_all"
  on public.guestbook_entries for insert
  with check (true);
