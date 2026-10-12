'use client';

import React from 'react';
import { OrderStatus } from '../supabase/types';
import { Check, Clock, Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

interface OrderStepperProps {
  status: OrderStatus;
  trackingNumber?: string;
  courierCode?: string;
  shippedAt?: string;
}

const STEPS = [
  { id: 'pending_payment', label: 'รอชำระเงิน', desc: 'ลูกค้าเลือกวิธีชำระ' },
  { id: 'payment_verifying', label: 'รอตรวจสอบยอดโอน', desc: 'ระบบกำลังตรวจสลิป' },
  { id: 'confirmed', label: 'ยืนยันการชำระเงิน', desc: 'ตรวจสอบยอดเรียบร้อย' },
  { id: 'packed', label: 'กำลังแพ็คพัสดุ', desc: 'เตรียมติดใบปะหน้า' },
  { id: 'shipped', label: 'จัดส่งแล้ว', desc: 'ส่งมอบให้บริษัทขนส่ง' },
  { id: 'delivered', label: 'จัดส่งสำเร็จ', desc: 'พัสดุถึงมือผู้รับ' },
];

export const OrderStepper: React.FC<OrderStepperProps> = ({
  status,
  trackingNumber,
  courierCode,
  shippedAt,
}) => {
  const getStepIndex = (st: OrderStatus): number => {
    switch (st) {
      case 'pending_payment':
        return 0;
      case 'payment_verifying':
        return 1;
      case 'confirmed':
      case 'processing':
        return 2;
      case 'packed':
        return 3;
      case 'shipped':
        return 4;
      case 'delivered':
        return 5;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  if (status === 'cancelled') {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-300">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-xs font-bold">คำสั่งซื้อนี้ถูกยกเลิกแล้ว</p>
          <p className="text-[11px]">หากต้องการสั่งซื้อใหม่ สามารถทำรายการได้จากหน้าหลัก</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      {/* Stepper Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-1.5 mb-6 text-xs flex rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-zinc-950 dark:bg-white transition-all duration-500 ease-out"
          />
        </div>

        {/* Step Nodes */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                      : isCurrent
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 ring-4 ring-zinc-200 dark:ring-zinc-800'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                </div>

                <div className="mt-2">
                  <p
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? 'text-zinc-950 dark:text-white font-bold'
                        : isCompleted
                        ? 'text-zinc-700 dark:text-zinc-300'
                        : 'text-zinc-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-zinc-400 hidden sm:block mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Courier Tracking Info Box (if shipped) */}
      {trackingNumber && (
        <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                เลขพัสดุ: <span className="font-mono text-emerald-600 font-bold">{trackingNumber}</span>
              </p>
              <p className="text-[11px] text-zinc-500">
                ขนส่งโดย {courierCode?.toUpperCase().replace('_', ' ')}
              </p>
            </div>
          </div>

          <a
            href={`https://www.flashexpress.co.th/tracking/?se=${trackingNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-lg hover:opacity-90 text-center shrink-0 transition-opacity"
          >
            ตรวจสอบสถานะพัสดุเรียลไทม์ →
          </a>
        </div>
      )}
    </div>
  );
};

