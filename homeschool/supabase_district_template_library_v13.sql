-- District-specific document template library.
-- Run once in Supabase Dashboard > SQL Editor after the district officer migrations.

begin;

create table if not exists public.district_document_templates (
  id uuid primary key default gen_random_uuid(),
  district_id uuid not null references public.education_districts(id) on delete cascade,
  uploaded_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category text not null check (category in (
    'request_form',
    'early_childhood_plan',
    'primary_plan',
    'other'
  )),
  title text not null check (char_length(trim(title)) between 1 and 200),
  description text,
  storage_bucket text not null default 'district-templates'
    check (storage_bucket = 'district-templates'),
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0 and file_size_bytes <= 20971520),
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create index if not exists district_document_templates_district_idx
on public.district_document_templates(district_id, created_at desc);

alter table public.district_document_templates enable row level security;
grant select, insert, delete on public.district_document_templates to authenticated;

drop policy if exists "district_template_officers_select" on public.district_document_templates;
create policy "district_template_officers_select"
on public.district_document_templates for select
to authenticated
using (
  exists (
    select 1
    from public.district_officer_profiles dop
    join public.profiles p on p.id = dop.user_id
    where dop.user_id = (select auth.uid())
      and dop.verified_district_id = district_document_templates.district_id
      and p.role = 'district'
      and p.approval_status = 'active'
  )
);

drop policy if exists "district_template_parents_select" on public.district_document_templates;
create policy "district_template_parents_select"
on public.district_document_templates for select
to authenticated
using (
  exists (
    select 1
    from public.students s
    where s.owner_user_id = (select auth.uid())
      and s.district_id = district_document_templates.district_id
  )
);

drop policy if exists "district_template_officers_insert" on public.district_document_templates;
create policy "district_template_officers_insert"
on public.district_document_templates for insert
to authenticated
with check (
  uploaded_by = (select auth.uid())
  and exists (
    select 1
    from public.district_officer_profiles dop
    join public.profiles p on p.id = dop.user_id
    where dop.user_id = (select auth.uid())
      and dop.verified_district_id = district_document_templates.district_id
      and p.role = 'district'
      and p.approval_status = 'active'
  )
);

drop policy if exists "district_template_officers_delete" on public.district_document_templates;
create policy "district_template_officers_delete"
on public.district_document_templates for delete
to authenticated
using (
  exists (
    select 1
    from public.district_officer_profiles dop
    join public.profiles p on p.id = dop.user_id
    where dop.user_id = (select auth.uid())
      and dop.verified_district_id = district_document_templates.district_id
      and p.role = 'district'
      and p.approval_status = 'active'
  )
);

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'district-templates',
  'district-templates',
  false,
  20971520,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'application/octet-stream'
  ]::text[]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Object path: {district_id}/{auth.uid()}/{uuid}.{extension}
drop policy if exists "district_template_storage_select" on storage.objects;
create policy "district_template_storage_select"
on storage.objects for select
to authenticated
using (
  bucket_id = 'district-templates'
  and (
    exists (
      select 1
      from public.district_officer_profiles dop
      join public.profiles p on p.id = dop.user_id
      where dop.user_id = (select auth.uid())
        and dop.verified_district_id::text = (storage.foldername(name))[1]
        and p.role = 'district'
        and p.approval_status = 'active'
    )
    or exists (
      select 1
      from public.students s
      where s.owner_user_id = (select auth.uid())
        and s.district_id::text = (storage.foldername(name))[1]
    )
  )
);

drop policy if exists "district_template_storage_insert" on storage.objects;
create policy "district_template_storage_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'district-templates'
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and exists (
    select 1
    from public.district_officer_profiles dop
    join public.profiles p on p.id = dop.user_id
    where dop.user_id = (select auth.uid())
      and dop.verified_district_id::text = (storage.foldername(name))[1]
      and p.role = 'district'
      and p.approval_status = 'active'
  )
);

drop policy if exists "district_template_storage_delete" on storage.objects;
create policy "district_template_storage_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'district-templates'
  and exists (
    select 1
    from public.district_officer_profiles dop
    join public.profiles p on p.id = dop.user_id
    where dop.user_id = (select auth.uid())
      and dop.verified_district_id::text = (storage.foldername(name))[1]
      and p.role = 'district'
      and p.approval_status = 'active'
  )
);

commit;

