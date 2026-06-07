-- Run once in Supabase Dashboard > SQL Editor.
-- Publishes lesson 1 only when both video and PDF have already been uploaded.

update public.robot_lessons
set is_published = true,
    updated_at = now()
where lesson_number = 1
  and (video_path is not null or video_url is not null)
  and instruction_pdf_path is not null;

select
  lesson_number,
  title,
  video_path,
  video_url,
  instruction_pdf_path,
  is_published
from public.robot_lessons
where lesson_number = 1;
