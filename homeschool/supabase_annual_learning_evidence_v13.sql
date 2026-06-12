-- Annual learning evidence draft data.
-- Original photos stay in the parent's browser and are not stored in this JSON column.
-- Run once in Supabase Dashboard > SQL Editor.

begin;

alter table public.homeschool_applications
  add column if not exists annual_evidence_data jsonb not null default '{}'::jsonb;

comment on column public.homeschool_applications.annual_evidence_data is
  'Text-only draft and document metadata for annual learning evidence. Final combined PDF is stored in official_documents.';

commit;
