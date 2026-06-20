-- Toko & Poppy Institute Partner Leads
-- Run this in Supabase SQL Editor after the main admin/private admin functions exist.

create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.partner_leads (
  id uuid primary key default gen_random_uuid(),
  contact_name text not null,
  contact_email text,
  contact_phone text,
  line_id text,
  institute_name text,
  province text not null,
  district text not null,
  has_institute text not null default 'planning',
  interested_courses text[] not null default '{}',
  message text,
  consent_contact boolean not null default false,
  follow_status text not null default 'new',
  admin_note text,
  follow_updated_at timestamptz,
  source text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.partner_leads
  add column if not exists contact_name text,
  add column if not exists contact_email text,
  add column if not exists contact_phone text,
  add column if not exists line_id text,
  add column if not exists institute_name text,
  add column if not exists province text,
  add column if not exists district text,
  add column if not exists has_institute text default 'planning',
  add column if not exists interested_courses text[] default '{}',
  add column if not exists message text,
  add column if not exists consent_contact boolean default false,
  add column if not exists follow_status text default 'new',
  add column if not exists admin_note text,
  add column if not exists follow_updated_at timestamptz,
  add column if not exists source text,
  add column if not exists user_agent text,
  add column if not exists created_at timestamptz default now();

alter table public.partner_leads
  alter column contact_name set not null,
  alter column province set not null,
  alter column district set not null,
  alter column has_institute set not null,
  alter column interested_courses set not null,
  alter column consent_contact set not null,
  alter column follow_status set not null,
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'partner_leads_contact_required'
  ) then
    alter table public.partner_leads
      add constraint partner_leads_contact_required
      check (contact_email is not null or contact_phone is not null or line_id is not null);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'partner_leads_has_institute_check'
  ) then
    alter table public.partner_leads
      add constraint partner_leads_has_institute_check
      check (has_institute in ('yes', 'planning', 'no'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'partner_leads_follow_status_check'
  ) then
    alter table public.partner_leads
      add constraint partner_leads_follow_status_check
      check (follow_status in ('new', 'contacted', 'interested', 'meeting_booked', 'sample_sent', 'converted', 'not_fit'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'partner_leads_consent_required'
  ) then
    alter table public.partner_leads
      add constraint partner_leads_consent_required
      check (consent_contact = true);
  end if;
end $$;

create index if not exists partner_leads_created_at_idx
  on public.partner_leads (created_at desc);

create index if not exists partner_leads_follow_status_idx
  on public.partner_leads (follow_status);

create index if not exists partner_leads_area_idx
  on public.partner_leads (province, district);

create index if not exists partner_leads_courses_idx
  on public.partner_leads using gin (interested_courses);

alter table public.partner_leads enable row level security;

drop policy if exists "Anyone can submit partner leads" on public.partner_leads;
create policy "Anyone can submit partner leads"
  on public.partner_leads
  for insert
  to anon, authenticated
  with check (
    consent_contact = true
    and contact_name is not null
    and province is not null
    and district is not null
    and array_length(interested_courses, 1) > 0
    and (contact_email is not null or contact_phone is not null or line_id is not null)
  );

drop policy if exists "Admins can read partner leads" on public.partner_leads;
create policy "Admins can read partner leads"
  on public.partner_leads
  for select
  to authenticated
  using (private.is_admin());

drop policy if exists "Admins can update partner leads" on public.partner_leads;
create policy "Admins can update partner leads"
  on public.partner_leads
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

drop policy if exists "Admins can delete partner leads" on public.partner_leads;
create policy "Admins can delete partner leads"
  on public.partner_leads
  for delete
  to authenticated
  using (private.is_admin());

grant insert on public.partner_leads to anon, authenticated;
grant select, update, delete on public.partner_leads to authenticated;
