# E-Commerce Platform

Next.js e-commerce project สำหรับจัดการร้านค้าออนไลน์แบบครบวงจร ครอบคลุมด้าน storefront, admin, ออเดอร์, การชำระเงิน, การเชื่อมต่อ LINE, Shopee และ Supabase

## คุณสมบัติ

- หน้า storefront สำหรับแสดงสินค้าและตะกร้าสินค้า
- หน้า admin สำหรับจัดการสินค้า, ผู้ใช้, ออเดอร์ และการผสานระบบ
- ระบบชำระเงิน PromptPay / QR
- การจัดการคำสั่งซื้อและขั้นตอนการจัดส่ง
- การเชื่อมต่อ Supabase, LINE Messaging API และ Shopee API
- รองรับ Mobile app ในโฟลเดอร์ `mobile/`

## ข้อกำหนดก่อนติดตั้ง

- Node.js 18 หรือสูงกว่า
- npm หรือ pnpm
- Git

## การติดตั้ง

1. Clone repository
   ```bash
   git clone https://github.com/Siri1service/com.git
   cd com
   ```

2. ติดตั้ง dependencies
   ```bash
   npm install
   ```

3. ตั้งค่า environment variables
   ```bash
   cp .env.example .env.local
   ```
   จากนั้นแก้ไขค่าต่าง ๆ ในไฟล์ `.env.local` ให้ตรงกับข้อมูลจริงของ Supabase, LINE, Shopee และ SMTP

   ตัวอย่างตัวแปรที่ต้องกำหนด:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   LINE_CHANNEL_ACCESS_TOKEN=
   LINE_ADMIN_USER_ID=
   SHOPEE_PARTNER_ID=
   SHOPEE_PARTNER_KEY=
   SHOPEE_SHOP_ID=
   GMAIL_USER=
   GMAIL_APP_PASSWORD=
   FLASH_EXPRESS_API_KEY=
   THAI_POST_API_KEY=
   ```

## การรันแอปพลิเคชัน

### Development mode
```bash
npm run dev
```
เปิดที่: http://localhost:3000

### Production build
```bash
npm run build
npm run start
```

### ตรวจสอบ lint
```bash
npm run lint
```

## โครงสร้างโปรเจกต์

```text
.
├── src/                 # Frontend ของ Next.js app
├── mobile/             # Expo / React Native app
├── supabase/           # SQL schema และ seed data
├── .env.example        # ตัวอย่าง environment variables
├── next.config.mjs    # Next.js config
├── package.json        # Scripts และ dependencies
├── tailwind.config.ts # Tailwind config
├── tsconfig.json
└── README.md
```

## หมายเหตุ

- หากต้องการใช้งาน mobile app ให้เข้าไปที่โฟลเดอร์ `mobile/` และติดตั้ง dependencies เพิ่มเติมตาม README ภายในโฟลเดอร์นั้น
- สำหรับ deployment บน Vercel ให้ตั้งค่า environment variables เหมือนกับ `.env.local`

## License

Project นี้ใช้สำหรับการพัฒนาและทดลองใช้งานภายในทีม/ร้านค้า หากต้องใช้งานเชิงพาณิชย์ กรุณาตรวจสอบเงื่อนไขการใช้งานที่เหมาะสมก่อน deploy จริง
