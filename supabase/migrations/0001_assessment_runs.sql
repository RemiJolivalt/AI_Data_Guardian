-- Assessment runs persistence (ADR-0003, ADR-0008).
-- Run this in the Supabase SQL editor (or via psql with SUPABASE_DB_URL).

create table if not exists public.assessment_runs (
  id            text primary key,
  scenario      text not null,
  status        text not null,
  overall       numeric,
  is_synthetic  boolean not null default true,
  result        jsonb not null,
  created_at    timestamptz not null default now()
);

create index if not exists assessment_runs_created_at_idx
  on public.assessment_runs (created_at desc);

-- RLS on: only the service-role key (server-side) may read/write. No anon access.
alter table public.assessment_runs enable row level security;
-- Assessment runs persistence (ADR-0008). Run this in the Supabase SQL editor.
create table if not exists public.assessment_runs (
  id           text primary key,
  scenario     text not null,
  status       text not null,
  overall      numeric,
  is_synthetic boolean not null default true,
  result       jsonb not null,
  created_at   timestamptz not null default now()
);

create index if not exists assessment_runs_created_at_idx
  on public.assessment_runs (created_at desc);

-- Lock down access: the service-role key (server-only) bypasses RLS; no public access.
alter table public.assessment_runs enable row level security;
-- No permissive policy is created on purpose: anon/authenticated clients get no access.
