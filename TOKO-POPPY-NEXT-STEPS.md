# Toko & Poppy Safe Next Steps

อัปเดตล่าสุด: 12 มิถุนายน 2026

## สถานะที่ตรวจแล้ว

- JavaScript หลักผ่าน syntax check แล้ว:
  - `script.js`
  - `admin.js`
  - `robot-lessons.js`
  - `art-lessons.js`
  - `codekids.js`
- Homeschool ถูกวางแยกไว้ในโฟลเดอร์ `homeschool/` จึงไม่แตะ logic สมัครเรียน, admin, robot, art, หรือ Codekids เดิมโดยตรง
- หน้า admin มีลิงก์ดูหน้าเด็กแบบ preview แล้ว:
  - Robot: `robot-lessons.html?adminPreview=1`
  - Art: `art-lessons.html?adminPreview=1`
- หน้า admin มี filter ใบสมัครตามช่องทาง, สาขา, วันที่สมัคร, สถานะ และช่องค้นหาแล้ว
- หน้า register ส่งข้อมูลไปที่ RPC `submit_enrollment` และรองรับข้อมูล:
  - สมัครออนไลน์ / สมัครผ่านสาขา
  - สาขาเฟรนไชน์
  - ชื่อจริง, ชื่อเล่น, ผู้ปกครอง, เบอร์โทร, อีเมล
  - วันเกิด และให้ฐานข้อมูลคำนวณ `age_years`
  - วิธีชำระเงิน, ยอดชำระ, วันที่ชำระ, หลักฐานโอนถ้ามี
  - แพ้อาหาร, แพ้เกสร / ภูมิแพ้, ข้อมูลเพิ่มเติม

## สิ่งที่ควรทำก่อนทดสอบสมัครจริง

1. รัน SQL แก้ `payment_status` ใน Supabase ถ้ายังเจอ error นี้:

   `column "payment_status" is of type public.payment_status but expression is of type text`

   ให้รันไฟล์นี้ใน Supabase SQL Editor:

   `fix-submit-enrollment-payment-status.sql`

2. สมัครทดสอบด้วยอีเมลใหม่ 1 คน โดยเลือก:
   - สมัครออนไลน์
   - วิธีชำระเงิน: ยังไม่ชำระ หรือ โอนเงินพร้อมสลิป
   - เลือกคอร์สอย่างน้อย 1 คอร์ส

3. เปิดหน้า admin แล้วตรวจว่าใบสมัครใหม่แสดงในตารางหรือไม่

4. ทดสอบ filter ใน admin:
   - ทั้งหมด
   - รอตรวจ
   - เฉพาะออนไลน์
   - เฉพาะสาขา
   - ค้นหาชื่อนักเรียน / ชื่อเล่น / เบอร์โทร
   - วันที่สมัครตั้งแต่ / ถึงวันที่

5. กดดูรายละเอียดใบสมัคร แล้วตรวจ:
   - หลักฐานโอนเปิดดูได้ ถ้ามี
   - เงินสดแสดงว่าไม่มีหลักฐานได้ถูกต้อง
   - วันเกิดและอายุแสดงถูกต้อง
   - แอดมินเลือกเปิดสิทธิ์โรบอท / ศิลปะได้

## สิ่งที่ยังไม่ควรทำทันที

- ยังไม่ควรรัน SQL ของ Homeschool ลง Supabase ตัวจริงจนกว่าจะทำ migration แยกชื่อ table/function ให้ชัด
- ยังไม่ควรเชื่อมข้อมูล Homeschool เข้ากับระบบสมาชิกหลักจนกว่าจะกำหนดว่าเด็ก 1 คนจะมี homeschool profile ร่วมกับคอร์สเดิมอย่างไร
- ยังไม่ควรลบ backup folder เก่าใน `outputs/` จนกว่าจะมี zip หรือ commit ที่มั่นใจแล้ว

## งานถัดไปที่แนะนำ

1. ทดสอบสมัครเรียนจริง 1 รอบหลังรัน SQL fix
2. ตรวจหน้า admin ว่าเห็นใบสมัครใหม่และ approve ได้
3. ทดสอบ login เป็นเด็กหลัง approve แล้วเข้าคอร์ส Robot / Art / Codekids
4. ถ้าทุกอย่างนิ่ง ค่อยทำ SQL migration สำหรับ Homeschool แบบแยก namespace

