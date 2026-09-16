create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  website text,
  budget numeric,
  timeline text,
  requirement text not null,
  score integer,
  intent text,
  urgency text,
  summary text,
  services jsonb default '[]'::jsonb,
  recommended_action text,
  follow_up_subject text,
  follow_up_message text,
  approval_status text not null default 'pending',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'medium',
  status text not null default 'todo',
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_activity (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  action text not null,
  details jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists tasks_lead_id_idx on public.tasks(lead_id);
create index if not exists ai_activity_lead_id_idx on public.ai_activity(lead_id);
