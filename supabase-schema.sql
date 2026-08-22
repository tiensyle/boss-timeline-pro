-- Boss Timeline Pro — Supabase Realtime setup
-- Run this entire script in Supabase SQL Editor.

create table if not exists public.boss_timeline_state (
  id bigint primary key,
  data jsonb not null default '{"bosses":[],"history":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Grant permissions to anon and authenticated roles
grant usage on schema public to anon, authenticated;
grant all on table public.boss_timeline_state to anon, authenticated;

alter table public.boss_timeline_state enable row level security;

-- Drop previous policies if existing
drop policy if exists "boss timeline read" on public.boss_timeline_state;
drop policy if exists "boss timeline insert" on public.boss_timeline_state;
drop policy if exists "boss timeline update" on public.boss_timeline_state;
drop policy if exists "boss timeline delete" on public.boss_timeline_state;

create policy "boss timeline read"
on public.boss_timeline_state for select
to anon, authenticated
using (true);

create policy "boss timeline insert"
on public.boss_timeline_state for insert
to anon, authenticated
with check (true);

create policy "boss timeline update"
on public.boss_timeline_state for update
to anon, authenticated
using (true)
with check (true);

create policy "boss timeline delete"
on public.boss_timeline_state for delete
to anon, authenticated
using (true);

-- Enable Postgres Realtime for this table.
alter table public.boss_timeline_state replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.boss_timeline_state;
exception
  when duplicate_object then null;
end $$;
