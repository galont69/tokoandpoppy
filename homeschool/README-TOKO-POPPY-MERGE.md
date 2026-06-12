# Homeschool Module

โฟลเดอร์นี้นำมาจาก `homeschool-primary-plan-v49` เพื่อรวมเป็นส่วนหนึ่งของเว็บ Toko & Poppy

จุดเข้าใช้งาน:

- หน้าแรกของโมดูล: `homeschool/index.html`
- หน้าแอดมิน Homeschool: `homeschool/admin.html`
- หน้า parent/teacher/district/marketplace ยังอยู่ในโฟลเดอร์เดียวกันและใช้ลิงก์เดิม

หมายเหตุสำคัญ:

- โมดูล Homeschool เดิมฝังค่า Supabase ของโปรเจกต์เดิมไว้ในไฟล์ HTML หลายหน้า
- ถ้าต้องการให้ใช้ Supabase โปรเจกต์เดียวกับ Toko & Poppy ต้องย้าย schema และปรับ config/auth/role เพิ่มอีกเฟส เพื่อไม่ให้กระทบระบบสมัครเรียนและบทเรียนที่ใช้อยู่ตอนนี้
