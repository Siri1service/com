'use client';

import React from 'react';
import Link from 'next/link';
import { useData } from '../../lib/store/data';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Users,
  ArrowRight,
  Printer,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { products, orders, users } = useData();

  // Metrics
  const totalRevenue = orders.reduce(
    (sum, o) => (o.payment_status === 'paid' ? sum + o.total_amount : sum),
    0
  );
  const pendingSlipOrders = orders.filter((o) => o.status === 'payment_verifying');
  const lowStockProducts = products.filter((p) => p.stock_quantity <= 10);
  const juristicUsers = users.filter((u) => u.account_type === 'juristic');

  return (
    <div className="space-y-8">
      {/* Top Welcome & KPI Cards */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
          ภาพรวมร้านค้าและระบบปฏิบัติการ
        </h1>
        <p className="text-xs text-zinc-500">
          ติดตามยอดขาย คำสั่งซื้อที่ต้องตรวจสลิป และสต็อกสินค้าแบบเรียลไทม์
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">ยอดขายที่ยืนยันแล้ว</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-zinc-950 dark:text-white">
            ฿{totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 inline" /> ยอดโอนตรงตามระบบ 100%
          </p>
        </div>

        {/* Pending Slips Alert */}
        <Link
          href="/admin/orders"
          className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-2 shadow-xs hover:border-amber-400 transition-colors group block"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">รอตรวจสอบสลิป</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">
            {pendingSlipOrders.length} รายการ
          </p>
          <p className="text-[11px] text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors flex items-center gap-1">
            <span>คลิกเพื่อเปิดตรวจสลิปทันที</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Low Stock Alert */}
        <Link
          href="/admin/products"
          className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-2 shadow-xs hover:border-rose-400 transition-colors group block"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">สินค้าใกล้หมด (&le; 10)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600">
            {lowStockProducts.length} รายการ
          </p>
          <p className="text-[11px] text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors flex items-center gap-1">
            <span>จัดการสต็อกสินค้า</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Total Customers */}
        <Link
          href="/admin/users"
          className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-2 shadow-xs hover:border-zinc-400 transition-colors group block"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">สมาชิกลงทะเบียน</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-zinc-950 dark:text-white">
            {users.length} คน
          </p>
          <p className="text-[11px] text-zinc-500">
            นิติบุคคล {juristicUsers.length} บริษัท • ธรรมดา {users.length - juristicUsers.length} คน
          </p>
        </Link>
      </div>

      {/* Two Columns: Recent Orders & Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white">คำสั่งซื้อล่าสุด</h3>
              <p className="text-[11px] text-zinc-400">รายการสั่งซื้อที่รอจัดส่งและตรวจสลิป</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  <th className="pb-3">รหัสออเดอร์</th>
                  <th className="pb-3">ลูกค้า</th>
                  <th className="pb-3">ยอดชำระ</th>
                  <th className="pb-3">สถานะ</th>
                  <th className="pb-3 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-zinc-900 dark:text-white">
                      {order.order_number}
                    </td>
                    <td className="py-3">
                      <p className="font-semibold text-zinc-900 dark:text-white truncate max-w-[140px]">
                        {order.customer_name}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono">{order.customer_phone}</p>
                    </td>
                    <td className="py-3 font-bold">
                      ฿{order.total_amount.toLocaleString()}
                    </td>
                    <td className="py-3">
                      {order.status === 'payment_verifying' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                          รอตรวจสลิป
                        </span>
                      )}
                      {order.status === 'confirmed' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                          ชำระแล้ว
                        </span>
                      )}
                      {order.status === 'shipped' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
                          จัดส่งแล้ว
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/orders?orderId=${order.id}`}
                        className="text-xs font-semibold px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-lg inline-block"
                      >
                        จัดการ
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Shopee Sync Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center justify-between">
              <span>แจ้งเตือนคลังสินค้า</span>
              <span className="text-[10px] font-mono text-zinc-400">Low Stock Alert</span>
            </h3>

            <div className="space-y-3">
              {lowStockProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 border border-zinc-200 dark:border-zinc-700">
                      <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {prod.title}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono">SKU: {prod.sku}</p>
                    </div>
                  </div>

                  <span className="px-2 py-1 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-xs font-black rounded-lg shrink-0">
                    {prod.stock_quantity} ชิ้น
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/admin/products"
              className="block w-full py-2.5 text-center bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
            >
              เติมสต็อกและจัดการสินค้า
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

