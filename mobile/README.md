# Minimal Studio Mobile App (React Native & Expo)

รองรับทุกแพลตฟอร์มทั้ง **iOS** และ **Android** พัฒนาด้วย React Native 100% เชื่อมต่อฐานข้อมูล Supabase และแชร์ API เดียวกันกับ Web App บน Vercel

---

## 📱 วิธีการรันแอปบนอุปกรณ์มือถือ

### 1. ติดตั้ง Dependencies ในโฟลเดอร์ mobile
```bash
cd mobile
npm install
```

### 2. เริ่มต้นรันแอปพลิเคชัน
```bash
npx expo start
```

### 3. เปิดใช้งานบนอุปกรณ์ที่คุณต้องการ:
- **iPhone / Android จริง**: ดาวน์โหลดแอป **Expo Go** จาก App Store หรือ Google Play Store แล้วเปิดกล้องสแกน QR Code ที่แสดงบน Terminal
- **iOS Simulator (Mac)**: กดปุ่ม `i` ใน Terminal เพื่อเปิดบน iOS Simulator (ต้องติดตั้ง Xcode)
- **Android Emulator**: กดปุ่ม `a` ใน Terminal เพื่อเปิดบน Android Studio Emulator
- **Web Browser**: กดปุ่ม `w` เพื่อรันเวอร์ชันเว็บ

---

## 🛠 คุณสมบัติหลักบน Mobile App
- **Storefront & Catalog**: เลือกชมสินค้า พร้อมรูปภาพความละเอียดสูง แปลงเป็น WebP
- **Cart & Express Checkout**: ตะกร้าสินค้าและระบบคำนวณค่าส่งฟรี
- **PromptPay QR**: แสดงข้อมูลพร้อมเพย์สำหรับสแกนจ่ายเงินผ่าน Mobile Banking
- **Slip Upload**: จำลองการถ่ายภาพและแนบสลิปโอนเงิน
- **Order Pipeline Stepper**: แสดงขั้นตอนการเตรียมพัสดุและเลขแทร็กกิ้ง
- **Tax & Profile Onboarding**: เลือกระหว่างบุคคลธรรมดา / นิติบุคคล ระบุเลขประจำตัวผู้เสียภาษี 13 หลัก และที่อยู่จัดส่ง

