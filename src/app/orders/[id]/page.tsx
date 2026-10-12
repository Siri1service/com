'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useData } from '../../../lib/store/data';
import { OrderStepper } from '../../../components/OrderStepper';
import { WaybillPrintModal } from '../../../components/WaybillPrintModal';
import {
  Printer,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  Receipt,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { orders } = useData();
  const [waybillOpen, setWaybillOpen] = useState(false);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">ไม่พบคำสั่งซื้อที่ระบุ</h2>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-zinc-950 text-white rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปหน้ารวมคำสั่งซื้อ</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ย้อนกลับไปหน้ารวมคำสั่งซื้อ</span>
          </Link>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
            คำสั่งซื้อ #{order.order_number}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            สั่งซื้อเมื่อ {new Date(order.created_at).toLocaleString('th-TH')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWaybillOpen(true)}
            className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>ใบปะหน้าพัสดุ (Waybill)</span>
          </button>
        </div>
      </div>

      {/* STEPPER PIPELINE TRACKER */}
      <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xs">
        <h3 className="text-sm font-bold text-zinc-950 dark:text-white mb-2">
          สถานะขั้นตอนคำสั่งซื้อ (Order Pipeline)
        </h3>
        <OrderStepper
          status={order.status}
          trackingNumber={order.tracking_number}
          courierCode={order.courier_code}
          shippedAt={order.shipped_at}
        />
      </div>

      {/* Two Column Layout: Items + Financial & Address Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Items Summary */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            รายการสินค้าที่สั่งซื้อ
          </h3>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {order.items?.map((it, idx) => (
              <div key={idx} className="py-3 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  <img src={it.image_url} alt={it.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                    {it.title}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    ฿{it.price.toLocaleString()} x {it.quantity}
                  </p>
                </div>
                <span className="text-xs font-bold font-mono">
                  ฿{(it.price * it.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>ยอดรวมสินค้า:</span>
              <span className="font-mono">฿{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>ค่าจัดส่ง:</span>
              <span className="font-mono">{order.shipping_fee === 0 ? 'ส่งฟรี' : `฿${order.shipping_fee}`}</span>
            </div>
            <div className="flex justify-between text-base font-black text-zinc-950 dark:text-white pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span>ยอดรวมทั้งสิ้น:</span>
              <span>฿{order.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Right: Payment, Slip & Delivery Address */}
        <div className="space-y-6">
          {/* Slip & Payment Status */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-zinc-950 dark:text-white" />
              <span>การชำระเงินและตรวจสอบยอด</span>
            </h3>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">ช่องทาง:</span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {order.payment_method === 'promptpay' ? 'พร้อมเพย์ QR' : 'โอนผ่านธนาคาร'}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">สถานะยอดเงิน:</span>
              {order.payment_status === 'paid' ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ตรวจสอบยอดถูกต้องแล้ว
                </span>
              ) : (
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> รอเจ้าหน้าที่ตรวจสอบสลิป
                </span>
              )}
            </div>

            {order.slip_url && (
              <div className="pt-2">
                <span className="text-[11px] text-zinc-400 block mb-1.5">หลักฐานการโอนเงิน (สลิป):</span>
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50">
                  <img src={order.slip_url} alt="Slip" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* Delivery & Tax Invoice Details */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-xs text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-zinc-950 dark:text-white" />
              <span>ที่อยู่จัดส่งพัสดุ</span>
            </h3>
            <p className="font-bold text-zinc-900 dark:text-white">
              {order.shipping_address?.recipient_name || order.customer_name} (
              {order.shipping_address?.phone || order.customer_phone})
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {order.shipping_address?.address_line1} {order.shipping_address?.subdistrict}{' '}
              {order.shipping_address?.district} {order.shipping_address?.province}{' '}
              {order.shipping_address?.postal_code}
            </p>

            {order.tax_invoice_required && (
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-blue-600 flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5" /> ออกใบกำกับภาษีเต็มรูป:
                </span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {order.tax_invoice_data?.name_or_company}
                </p>
                <p className="font-mono text-[11px] text-zinc-500">
                  เลขประจำตัวผู้เสียภาษี: {order.tax_invoice_data?.tax_id} (สาขา: {order.tax_invoice_data?.branch_id || '00000'})
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Waybill Modal Component */}
      <WaybillPrintModal
        order={order}
        isOpen={waybillOpen}
        onClose={() => setWaybillOpen(false)}
      />
    </div>
  );
}

