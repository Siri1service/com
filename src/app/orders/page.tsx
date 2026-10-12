'use client';

import React from 'react';
import Link from 'next/link';
import { useData } from '../../lib/store/data';
import { useAuth } from '../../lib/store/auth';
import { Package, ArrowRight, Clock, CheckCircle2, Truck } from 'lucide-react';

export default function OrdersListPage() {
  const { orders } = useData();
  const { user } = useAuth();

  // Filter orders by current user or show all in demo
  const userOrders = orders.filter((o) => !user || o.customer_email === user.email || !o.user_id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'payment_verifying':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
            รอตรวจสอบยอดโอน
          </span>
        );
      case 'confirmed':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
            ยืนยันการชำระเงินแล้ว
          </span>
        );
      case 'shipped':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            จัดส่งแล้ว (มีเลขพัสดุ)
          </span>
        );
      case 'delivered':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            จัดส่งสำเร็จ
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            รอชำระเงิน
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          ติดตามสถานะคำสั่งซื้อทั้งหมด
        </h1>
        <p className="text-xs text-zinc-500">
          ตรวจสอบขั้นตอนการดำเนินงาน ยอดชำระ และเลขติดตามพัสดุแบบเรียลไทม์
        </p>
      </div>

      {userOrders.length > 0 ? (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xs hover:shadow-minimal transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-sm text-zinc-950 dark:text-white">
                    #{order.order_number}
                  </span>
                  {getStatusBadge(order.status)}
                  <span className="text-xs text-zinc-400">
                    {new Date(order.created_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {order.items?.map((it, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden bg-zinc-100"
                      >
                        <img src={it.image_url} alt={it.title} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 pl-2">
                    {order.items?.map((it) => it.title).join(', ') || 'สินค้าในคำสั่งซื้อ'}
                  </div>
                </div>

                {order.tracking_number && (
                  <p className="text-xs text-emerald-600 font-mono font-semibold flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    <span>เลขพัสดุ: {order.tracking_number} ({order.courier_code?.toUpperCase()})</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                <div className="text-right">
                  <span className="text-[11px] text-zinc-400 block">ยอดรวมทั้งสิ้น</span>
                  <span className="text-lg font-black text-zinc-950 dark:text-white">
                    ฿{order.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <span>ดูสถานะ & ใบปะหน้า</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center space-y-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <Package className="w-10 h-10 mx-auto text-zinc-400 stroke-[1.5]" />
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">ยังไม่มีประวัติคำสั่งซื้อ</p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full text-xs font-semibold"
          >
            ไปหน้าแรกเพื่อเลือกซื้อสินค้า
          </Link>
        </div>
      )}
    </div>
  );
}

