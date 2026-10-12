'use client';

import React, { useState } from 'react';
import { useData } from '../../../lib/store/data';
import { shopeeClient } from '../../../lib/shopee-api';
import { COURIER_PROVIDERS } from '../../../lib/courier-api';
import { sendLineOrderNotification } from '../../../lib/line-api';
import {
  Share2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Truck,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Shield,
} from 'lucide-react';

export default function AdminIntegrationsPage() {
  const { products, orders } = useData();

  // Shopee Sync State
  const [syncingShopee, setSyncingShopee] = useState(false);
  const [shopeeSyncResult, setShopeeSyncResult] = useState<any>(null);

  // LINE Test State
  const [testingLine, setTestingLine] = useState(false);
  const [lineResult, setLineResult] = useState<string | null>(null);

  const handleSyncShopee = async () => {
    setSyncingShopee(true);
    try {
      const res = await shopeeClient.syncCatalogToShopee(products);
      setShopeeSyncResult(res);
    } catch (e: any) {
      console.error(e);
    } finally {
      setSyncingShopee(false);
    }
  };

  const handleTestLine = async () => {
    if (orders.length === 0) return;
    setTestingLine(true);
    setLineResult(null);
    try {
      const res = await sendLineOrderNotification(orders[0]);
      setLineResult(res.mocked ? 'จำลองการส่ง LINE Notification สำเร็จ (Mock Mode)' : 'ส่งข้อความเข้า LINE เรียบร้อยแล้ว!');
    } catch (e: any) {
      setLineResult(`เกิดข้อผิดพลาด: ${e.message}`);
    } finally {
      setTestingLine(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
          การเชื่อมต่อ API ภายนอก (API Integrations Hub)
        </h1>
        <p className="text-xs text-zinc-500">
          บริหารจัดการระบบเชื่อมต่อ Shopee, ระบบขนส่งพัสดุ (Flash, Kerry, ไปรษณีย์ไทย, J&T) และ LINE Messaging API
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Shopee Open Platform API */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                  S
                </span>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Shopee Open Platform</h3>
                  <p className="text-[10px] text-zinc-400">Partner API v2.0</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                Connected
              </span>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              ซิงค์ข้อมูลสินค้าและสต็อกระหว่างร้านค้ากับ Shopee Open Platform แบบสองทิศทาง (Bi-directional Sync)
            </p>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">สินค้าที่พร้อมซิงค์:</span>
                <span className="font-bold">{products.length} รายการ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">สถานะสต็อก:</span>
                <span className="font-bold text-emerald-600">ซิงค์อัตโนมัติเมื่อสั่งซื้อ</span>
              </div>
            </div>

            {shopeeSyncResult && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ซิงค์สำเร็จ {shopeeSyncResult.syncedCount} สินค้า
                </p>
                <p className="text-[10px]">อัปเดตสต็อกตรงกับแคตตาล็อก Shopee เรียบร้อย</p>
              </div>
            )}
          </div>

          <button
            onClick={handleSyncShopee}
            disabled={syncingShopee}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingShopee ? 'animate-spin' : ''}`} />
            <span>{syncingShopee ? 'กำลังซิงค์แคตตาล็อก...' : 'ซิงค์ข้อมูลกับ Shopee ทันที'}</span>
          </button>
        </div>

        {/* 2. Couriers & Logistics API */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                  <Truck className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">API ระบบขนส่งพัสดุ</h3>
                  <p className="text-[10px] text-zinc-400">Flash, EMS, Kerry, J&T</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                Ready
              </span>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              ออกเลขพัสดุ (Tracking Number) สร้างบาร์โค้ด และสั่งพิมพ์ใบปะหน้าพัสดุ (Waybill 100x150 มม.) ทันที
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Flash Express</span>
                <span className="text-[10px] font-mono text-zinc-500">API Connected</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">ไปรษณีย์ไทย (EMS)</span>
                <span className="text-[10px] font-mono text-zinc-500">API Connected</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Kerry Express</span>
                <span className="text-[10px] font-mono text-zinc-500">API Connected</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-[11px] text-zinc-500 text-center">
            รองรับเครื่องพิมพ์สติ๊กเกอร์ความร้อน (Thermal Label Printer 4x6 นิ้ว)
          </div>
        </div>

        {/* 3. LINE Messaging API */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#06C755] text-white flex items-center justify-center font-bold text-xs">
                  L
                </span>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">LINE Messaging API</h3>
                  <p className="text-[10px] text-zinc-400">Flex Message Webhook</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                Active
              </span>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              ส่ง Flex Message แจ้งเตือนแอดมินและลูกค้าอัตโนมัติเมื่อมีคำสั่งซื้อใหม่ ยืนยันยอดโอน และแจ้งเลขพัสดุ
            </p>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">การแจ้งเตือนคำสั่งซื้อ:</span>
                <span className="font-bold text-emerald-600">เปิดใช้งาน (Auto)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">แจ้งเตือนเลขพัสดุ:</span>
                <span className="font-bold text-emerald-600">เปิดใช้งาน (Auto)</span>
              </div>
            </div>

            {lineResult && (
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200">
                <p className="font-semibold">{lineResult}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleTestLine}
            disabled={testingLine}
            className="w-full py-3 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{testingLine ? 'กำลังส่งทดสอบ...' : 'ทดสอบส่งข้อความแจ้งเตือน LINE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

