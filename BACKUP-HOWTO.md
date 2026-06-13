# วิธีทำ Backup เว็บ Toko & Poppy

## Backup ล่าสุด

ไฟล์ backup ล่าสุดอยู่ที่:

`backups/toko-poppy-stable-20260613-071259.zip`

ชุดนี้เก็บเฉพาะไฟล์ใช้งานจริง ไม่รวมโฟลเดอร์ backup เก่าใน `outputs/`

## วิธีทำ Backup รอบต่อไป

เปิด Terminal ที่โฟลเดอร์โปรเจกต์:

```bash
cd /Users/ekkachaihuayyai/Documents/Codex/2026-06-07/files-mentioned-by-the-user-logo/outputs
```

สร้างโฟลเดอร์ backup:

```bash
mkdir -p backups
```

สร้างไฟล์ zip ใหม่ โดยเปลี่ยนวันที่ท้ายชื่อไฟล์ได้:

```bash
zip -r backups/toko-poppy-stable-YYYYMMDD-HHMMSS.zip \
  index.html styles.css script.js \
  admin.html admin.css admin.js \
  robot-lessons.html robot-lessons.css robot-lessons.js \
  art-lessons.html art-lessons.css art-lessons.js \
  codekids.html codekids.css codekids.js \
  supabase.js supabase-config.js \
  supabase-enrollment-schema.sql fix-submit-enrollment-payment-status.sql \
  ADMIN-SETUP.md TOKO-POPPY-NEXT-STEPS.md BACKUP-HOWTO.md \
  logo.png assets homeschool
```

## วิธี Restore

1. แตกไฟล์ zip backup
2. คัดลอกไฟล์ที่แตกได้กลับเข้าโฟลเดอร์ `outputs/`
3. อย่า restore ทับ `supabase-config.js` ถ้าคุณเปลี่ยน project Supabase ใหม่แล้ว
4. ถ้า restore ไปยังเครื่องใหม่ ให้ตรวจว่า `supabase-config.js` ยังเป็น URL และ anon key ของ project ที่ถูกต้อง

## ข้อควรระวัง

- Backup zip นี้สำรอง “โค้ดหน้าเว็บ” ไม่ได้สำรองข้อมูลจริงใน Supabase
- ถ้าต้อง backup ฐานข้อมูล ให้ export จาก Supabase Dashboard แยกต่างหาก
- ก่อนแก้ feature ใหญ่ เช่น Homeschool database integration ควรทำ backup zip ใหม่ทุกครั้ง

