-- Workspace persistence: learned rules (capitalization), supervision scope, context documents.
-- Run in the Supabase SQL editor (ADR-0003, ADR-0008).

create table if not exists public.learned_rules (
  id                  text primary key,
  domain_id           text not null,
  type                text not null,
  match_mode          text not null,
  match_value         text not null,
  proposed_value      text not null default '',
  source_suggestion_id text not null default '',
  approved_by         text not null default '',
  approved_at         timestamptz not null default now()
);
create index if not exists learned_rules_domain_idx on public.learned_rules (domain_id);

create table if not exists public.workspace_scope (
  domain_id  text primary key,
  assets     jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.context_documents (
  id           text primary key,
  domain_id    text not null,
  name         text not null,
  doc_type     text not null default 'document',
  text         text not null default '',
  is_synthetic boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists context_documents_domain_idx on public.context_documents (domain_id);

alter table public.learned_rules enable row level security;
alter table public.workspace_scope enable row level security;
alter table public.context_documents enable row level security;
