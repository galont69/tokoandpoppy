-- Toko & Poppy Free Learning Resources
-- Run after the existing admin schema SQL so private.is_admin() is available.

create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.free_resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('thai', 'math', 'science', 'art', 'unplugged_coding')),
  age_group text not null default '3-6 ปี',
  description text,
  video_url text,
  thumbnail_url text,
  worksheet_url text,
  worksheet_file_name text,
  powerpoint_url text,
  powerpoint_file_name text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.free_resource_leads (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references public.free_resources(id) on delete set null,
  resource_slug text,
  parent_name text not null,
  contact_email text,
  contact_phone text,
  line_id text,
  child_age text not null,
  province text not null,
  district text not null,
  interested_categories text[] not null default '{}',
  consent_contact boolean not null default false,
  source text,
  user_agent text,
  follow_status text not null default 'new',
  admin_note text,
  follow_updated_at timestamptz,
  created_at timestamptz not null default now(),
  constraint free_resource_leads_contact_check
    check (coalesce(nullif(contact_email, ''), nullif(contact_phone, ''), nullif(line_id, '')) is not null),
  constraint free_resource_leads_consent_check
    check (consent_contact is true),
  constraint free_resource_leads_follow_status_check
    check (follow_status in ('new', 'contacted', 'interested', 'trial_booked', 'enrolled', 'not_interested'))
);

alter table public.free_resource_leads
  add column if not exists follow_status text not null default 'new';

alter table public.free_resource_leads
  add column if not exists admin_note text;

alter table public.free_resource_leads
  add column if not exists follow_updated_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'free_resource_leads'
      and constraint_name = 'free_resource_leads_follow_status_check'
  ) then
    alter table public.free_resource_leads
      add constraint free_resource_leads_follow_status_check
      check (follow_status in ('new', 'contacted', 'interested', 'trial_booked', 'enrolled', 'not_interested'));
  end if;
end $$;

create index if not exists free_resources_status_created_idx
  on public.free_resources (status, created_at desc);
create index if not exists free_resources_category_idx
  on public.free_resources (category);
create index if not exists free_resource_leads_created_idx
  on public.free_resource_leads (created_at desc);
create index if not exists free_resource_leads_resource_idx
  on public.free_resource_leads (resource_id);
create index if not exists free_resource_leads_location_idx
  on public.free_resource_leads (province, district);
create index if not exists free_resource_leads_follow_status_idx
  on public.free_resource_leads (follow_status, created_at desc);

create or replace function public.set_free_resources_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_free_resources_updated_at on public.free_resources;
create trigger trg_free_resources_updated_at
before update on public.free_resources
for each row
execute function public.set_free_resources_updated_at();

alter table public.free_resources enable row level security;
alter table public.free_resource_leads enable row level security;

drop policy if exists "Public can read published free resources" on public.free_resources;
create policy "Public can read published free resources"
on public.free_resources
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Admins can manage free resources" on public.free_resources;
create policy "Admins can manage free resources"
on public.free_resources
for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Anyone can create free resource leads" on public.free_resource_leads;
create policy "Anyone can create free resource leads"
on public.free_resource_leads
for insert
to anon, authenticated
with check (
  consent_contact is true
  and parent_name is not null
  and child_age is not null
  and province is not null
  and district is not null
  and coalesce(nullif(contact_email, ''), nullif(contact_phone, ''), nullif(line_id, '')) is not null
);

drop policy if exists "Admins can read free resource leads" on public.free_resource_leads;
create policy "Admins can read free resource leads"
on public.free_resource_leads
for select
to authenticated
using (private.is_admin());

drop policy if exists "Admins can update free resource leads" on public.free_resource_leads;
create policy "Admins can update free resource leads"
on public.free_resource_leads
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Admins can delete free resource leads" on public.free_resource_leads;
create policy "Admins can delete free resource leads"
on public.free_resource_leads
for delete
to authenticated
using (private.is_admin());

grant select on public.free_resources to anon, authenticated;
grant insert on public.free_resource_leads to anon, authenticated;
grant insert, update, delete on public.free_resources to authenticated;
grant select, update, delete on public.free_resource_leads to authenticated;

insert into storage.buckets (id, name, public, file_size_limit)
values ('free-resources', 'free-resources', true, 83886080)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Public can read free resource files" on storage.objects;
create policy "Public can read free resource files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'free-resources');

drop policy if exists "Admins can upload free resource files" on storage.objects;
create policy "Admins can upload free resource files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'free-resources' and private.is_admin());

drop policy if exists "Admins can update free resource files" on storage.objects;
create policy "Admins can update free resource files"
on storage.objects
for update
to authenticated
using (bucket_id = 'free-resources' and private.is_admin())
with check (bucket_id = 'free-resources' and private.is_admin());

drop policy if exists "Admins can delete free resource files" on storage.objects;
create policy "Admins can delete free resource files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'free-resources' and private.is_admin());
