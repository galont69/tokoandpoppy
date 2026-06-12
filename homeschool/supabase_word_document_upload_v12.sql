-- Allow editable Word templates and uploaded request/plan documents.
-- Run once in Supabase Dashboard > SQL Editor.

begin;

alter table public.official_documents
  drop constraint if exists official_documents_document_type_check;

alter table public.official_documents
  add constraint official_documents_document_type_check
  check (document_type in (
    'father_identity',
    'mother_identity',
    'education_manager_identity',
    'student_identity',
    'father_house_registration',
    'father_national_id',
    'mother_house_registration',
    'mother_national_id',
    'education_manager_house_registration',
    'education_manager_national_id',
    'student_house_registration',
    'student_national_id',
    'student_birth_certificate',
    'education_manager_qualification',
    'student_education_record',
    'education_location',
    'student_photo_2inch',
    'request_form_document',
    'education_plan',
    'education_plan_document',
    'annual_assessment',
    'annual_evaluation',
    'assessment_report'
  ));

update storage.buckets
set
  file_size_limit = 10485760,
  allowed_mime_types = array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream'
  ]::text[]
where id = 'official-documents';

commit;

