'use client';

import React, { useState } from 'react';
import { useData } from '../../../lib/store/data';
import {
  Mail,
  Send,
  Users,
  Building2,
  Sparkles,
  CheckCircle2,
  Eye,
  Tag,
  ArrowRight,
} from 'lucide-react';

export default function AdminMarketingPage() {
  const { users, sendMarketingCampaign } = useData();

  const [audienceFilter, setAudienceFilter] = useState('all');
  const [subject, setSubject] = useState('✨ ส่วนลดพิเศษเฉพาะคุณ: สัมผัสคอลเลกชันใหม่จาก MINIMAL STUDIO');
  const [discountCode, setDiscountCode] = useState('MINIMAL15');
  const [discountRate, setDiscountRate] = useState('15%');
  const [content, setContent] = useState(
    'ขอขอบคุณที่ร่วมเป็นส่วนหนึ่งกับ MINIMAL STUDIO ทางเราขอมอบสิทธิประโยชน์พิเศษสำหรับสมาชิกคนพิเศษ รับส่วนลดทันทีสำหรับการสั่งซื้ออุปกรณ์แต่งโต๊ะทำงานและโคมไฟมินิมอล พร้อมบริการออกใบกำกับภาษีเต็มรูปและจัดส่งด่วนฟรี'
  );
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState<number | null>(null);

  // Calculate recipients count dynamically
  const recipientCount = users.filter((u) => {
    if (u.role === 'admin' || u.status !== 'active') return false;
    if (audienceFilter === 'juristic') return u.account_type === 'juristic';
    if (audienceFilter === 'repeat_customers') return (u.orders_count || 0) > 1;
    if (audienceFilter === 'inactive') return (u.orders_count || 0) === 0;
    return true;
  }).length;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSentSuccess(null);

    try {
      const result = await sendMarketingCampaign(subject, content, audienceFilter);
      setSentSuccess(result.sentCount);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
          การตลาดและการส่งอีเมลผ่าน Gmail (Email Marketing Hub)
        </h1>
        <p className="text-xs text-zinc-500">
          ส่งแคมเปญโปรโมชัน ข่าวสารสินค้าใหม่ และโค้ดส่วนลดไปยังลูกค้าผ่าน Gmail โดยแบ่งกลุ่มเป้าหมายได้แม่นยำ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Compose Email (7 cols) */}
        <form onSubmit={handleSend} className="lg:col-span-7 space-y-6">
          {/* Audience Filter Box */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>1. เลือกกลุ่มเป้าหมายผู้รับ (Audience Segment)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <label
                onClick={() => setAudienceFilter('all')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  audienceFilter === 'all'
                    ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <span>สมาชิกทั้งหมด</span>
              </label>

              <label
                onClick={() => setAudienceFilter('juristic')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  audienceFilter === 'juristic'
                    ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <span>เฉพาะนิติบุคคล (บริษัท)</span>
              </label>

              <label
                onClick={() => setAudienceFilter('repeat_customers')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  audienceFilter === 'repeat_customers'
                    ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <span>ลูกค้าประจำ (&gt; 1 ออเดอร์)</span>
              </label>

              <label
                onClick={() => setAudienceFilter('inactive')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  audienceFilter === 'inactive'
                    ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <span>ลูกค้าที่ยังไม่เคยสั่งซื้อ</span>
              </label>
            </div>

            <p className="text-[11px] text-zinc-500 pt-1">
              จำนวนผู้รับตามเงื่อนไข: <span className="font-bold text-zinc-950 dark:text-white">{recipientCount} รายการ</span>
            </p>
          </div>

          {/* Email Content Box */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>2. เนื้อหาอีเมลการตลาด (Email Content)</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                หัวข้ออีเมล (Subject Line)
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  โค้ดส่วนลด (Coupon Code)
                </label>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="w-full mt-1 px-4 py-2 text-xs font-mono font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  มูลค่าส่วนลด (เช่น 15%)
                </label>
                <input
                  type="text"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                  className="w-full mt-1 px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                ข้อความสื่อสาร (Body Message)
              </label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
              />
            </div>
          </div>

          {/* Submit Send Button */}
          <button
            type="submit"
            disabled={sending || recipientCount === 0}
            className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg disabled:opacity-40 transition-opacity"
          >
            {sending ? (
              <span>กำลังส่งอีเมลผ่าน Gmail...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ส่งอีเมลการตลาดไปยังผู้รับ {recipientCount} ท่าน</span>
              </>
            )}
          </button>

          {sentSuccess !== null && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">ส่งแคมเปญการตลาดสำเร็จแล้ว!</p>
                <p className="text-[11px]">ระบบได้นำส่งอีเมลผ่าน Gmail ให้แก่ลูกค้าจำนวน {sentSuccess} รายเรียบร้อย</p>
              </div>
            </div>
          )}
        </form>

        {/* Right Preview: Live HTML Email Template (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
            <Eye className="w-4 h-4" />
            <span>ตัวอย่างอีเมลที่ลูกค้าจะได้รับ (Live Gmail Preview)</span>
          </div>

          {/* Mock Gmail Window Frame */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-minimal text-black">
            {/* Fake Email Header */}
            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b border-zinc-200 dark:border-zinc-700 text-xs space-y-1">
              <p className="text-zinc-600 dark:text-zinc-300">
                <span className="font-bold">จาก:</span> Minimal Studio Marketing &lt;marketing@minimal-store.com&gt;
              </p>
              <p className="text-zinc-600 dark:text-zinc-300">
                <span className="font-bold">ถึง:</span> คุณลูกค้าคนสำคัญ (สมาชิก MINIMAL STUDIO)
              </p>
              <p className="font-bold text-zinc-950 dark:text-white pt-1">
                {subject}
              </p>
            </div>

            {/* Newsletter Body Layout */}
            <div className="p-6 bg-[#fafafa] space-y-6 text-zinc-800">
              {/* Brand Header */}
              <div className="text-center py-2 border-b border-zinc-200">
                <span className="font-black tracking-widest text-lg">MINIMAL STUDIO</span>
                <p className="text-[9px] uppercase tracking-widest text-zinc-400 mt-0.5">
                  Universal Modern E-Commerce
                </p>
              </div>

              {/* Message Content */}
              <div className="space-y-3 text-xs leading-relaxed text-zinc-700">
                <p className="font-bold text-zinc-950">สวัสดีครับ/ค่ะ,</p>
                <p>{content}</p>
              </div>

              {/* Coupon Box */}
              {discountCode && (
                <div className="bg-white border-2 border-dashed border-zinc-300 rounded-2xl p-4 text-center space-y-1.5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    โค้ดส่วนลดพิเศษ {discountRate}
                  </span>
                  <p className="text-lg font-mono font-black tracking-wider text-zinc-950">
                    {discountCode}
                  </p>
                  <p className="text-[9px] text-zinc-400">
                    ใช้ได้ทันทีในหน้าชำระเงินของ Minimal Studio
                  </p>
                </div>
              )}

              {/* Call to Action Button */}
              <div className="text-center pt-2">
                <span className="inline-block py-2.5 px-6 bg-zinc-950 text-white rounded-full text-xs font-bold shadow-sm">
                  ช้อปคอลเลกชันใหม่เลย →
                </span>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-zinc-200 text-center text-[10px] text-zinc-400 space-y-1">
                <p>© 2026 Minimal Studio Co., Ltd. กรุงเทพมหานคร</p>
                <p>หากไม่ต้องการรับข่าวสาร สามารถกดยกเลิกการรับข่าวสารได้ที่นี่</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

