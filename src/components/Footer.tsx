import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Receipt, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 mt-20 text-zinc-600 dark:text-zinc-400">
      {/* Brand Features Banner */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white shrink-0">
              <Truck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">จัดส่งรวดเร็วทั่วไทย</p>
              <p className="text-[11px] text-zinc-500">Flash, Kerry, EMS, J&T</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white shrink-0">
              <Receipt className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">ออกใบกำกับภาษีเต็มรูป</p>
              <p className="text-[11px] text-zinc-500">บุคคลธรรมดา & นิติบุคคล</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">ตรวจสลิปแม่นยำ</p>
              <p className="text-[11px] text-zinc-500">ยืนยันยอดและติดตามได้ทันที</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white shrink-0">
              <Sparkles className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">เชื่อมต่อ Shopee & LINE</p>
              <p className="text-[11px] text-zinc-500">แจ้งเตือนสถานะแบบ Real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                E
              </span>
              <span className="font-semibold text-sm tracking-tight text-zinc-950 dark:text-white">
                MINIMAL STUDIO
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              แพลตฟอร์มอีคอมเมิร์ซโมเดิร์นมินิมอล รองรับทั้ง Web, iOS และ Android บนโครงสร้าง Next.js, React Native และ Supabase
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              ช้อปปิ้ง & บริการ
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:underline">สินค้าทั้งหมด</Link></li>
              <li><Link href="/orders" className="hover:underline">ติดตามพัสดุ</Link></li>
              <li><Link href="/onboarding" className="hover:underline">ข้อมูลใบกำกับภาษี</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              สำหรับผู้ดูแลระบบ
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/admin" className="hover:underline">ภาพรวมยอดขาย & สินค้า</Link></li>
              <li><Link href="/admin/orders" className="hover:underline">ตรวจสอบยอดโอน & พิมพ์ใบปะหน้า</Link></li>
              <li><Link href="/admin/products" className="hover:underline">อัพโหลดรูปแปลงเป็น .WebP</Link></li>
              <li><Link href="/admin/marketing" className="hover:underline">ส่งแคมเปญการตลาดผ่าน Gmail</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              ช่องทางชำระ & ขนส่งพันธมิตร
            </h4>
            <div className="space-y-2 text-xs text-zinc-500">
              <p>• PromptPay QR Payment (พร้อมเพย์)</p>
              <p>• โอนเงินผ่านบัญชีธนาคารทุกธนาคาร</p>
              <p>• Flash Express / ไปรษณีย์ไทย EMS</p>
              <p>• Shopee Open Platform Synchronized</p>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400">
          <p>© 2026 Minimal Studio E-Commerce. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Vercel Ready • Supabase PostgreSQL • React Native Universal</p>
        </div>
      </div>
    </footer>
  );
};

