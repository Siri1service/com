'use client';

import React, { useState } from 'react';
import { useData } from '../../../lib/store/data';
import { Order, OrderStatus, CourierCode } from '../../../supabase/types';
import { SlipVerificationModal } from '../../../components/SlipVerificationModal';
import { WaybillPrintModal } from '../../../components/WaybillPrintModal';
import { COURIER_PROVIDERS } from '../../../lib/courier-api';
import {
  Printer,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, verifyPaymentSlip, updateOrderStatus, dispatchShipment } = useData();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modals State
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<Order | null>(null);
  const [selectedOrderForWaybill, setSelectedOrderForWaybill] = useState<Order | null>(null);
  const [dispatchModalOrder, setDispatchModalOrder] = useState<Order | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<CourierCode>('flash_express');
  const [dispatching, setDispatching] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'verifying'
        ? order.status === 'payment_verifying'
        : activeTab === 'confirmed'
        ? order.status === 'confirmed' || order.status === 'packed'
        : activeTab === 'shipped'
        ? order.status === 'shipped' || order.status === 'delivered'
        : true;

    const matchesSearch =
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_phone.includes(search) ||
      (order.tracking_number && order.tracking_number.toLowerCase().includes(search.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const handleDispatch = async () => {
    if (!dispatchModalOrder) return;
    setDispatching(true);
    try {
      await dispatchShipment(dispatchModalOrder.id, selectedCourier);
      setDispatchModalOrder(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
            จัดการคำสั่งซื้อและจัดส่ง (Orders & Logistics)
          </h1>
          <p className="text-xs text-zinc-500">
            ตรวจสอบยอดโอนจากสลิป พิมพ์ใบปะหน้าพัสดุ (Waybill) และเชื่อมต่อ API ขนส่ง
          </p>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            ทั้งหมด ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('verifying')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeTab === 'verifying'
                ? 'bg-amber-500 text-white'
                : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50'
            }`}
          >
            <span>รอตรวจสลิป</span>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              {orders.filter((o) => o.status === 'payment_verifying').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'confirmed'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            พร้อมจัดส่ง / แพ็คแล้ว
          </button>
          <button
            onClick={() => setActiveTab('shipped')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'shipped'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            จัดส่งแล้ว
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่คำสั่งซื้อ, เบอร์, ชื่อ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                <th className="py-3.5 px-4">คำสั่งซื้อ</th>
                <th className="py-3.5 px-4">ผู้สั่งซื้อ & ที่อยู่</th>
                <th className="py-3.5 px-4">ยอดเงิน & วิธีชำระ</th>
                <th className="py-3.5 px-4">สถานะสลิป / ขนส่ง</th>
                <th className="py-3.5 px-4 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  {/* Order Number & Items */}
                  <td className="py-3.5 px-4">
                    <p className="font-mono font-black text-zinc-950 dark:text-white">
                      #{order.order_number}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {new Date(order.created_at).toLocaleString('th-TH')}
                    </p>
                    <span className="text-[10px] text-zinc-500 block mt-1 line-clamp-1 max-w-[180px]">
                      {order.items?.map((it) => `${it.title} (x${it.quantity})`).join(', ')}
                    </span>
                  </td>

                  {/* Customer Info */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-zinc-900 dark:text-white">{order.customer_name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">{order.customer_phone}</p>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 max-w-[200px] mt-0.5">
                      {order.shipping_address?.address_line1} {order.shipping_address?.province}
                    </p>
                    {order.tax_invoice_required && (
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400 rounded">
                        ★ ขอใบกำกับภาษี ({order.tax_invoice_data?.account_type === 'juristic' ? 'นิติบุคคล' : 'บุคคล'})
                      </span>
                    )}
                  </td>

                  {/* Total & Payment */}
                  <td className="py-3.5 px-4">
                    <p className="font-black text-zinc-950 dark:text-white text-sm">
                      ฿{order.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      {order.payment_method === 'promptpay' ? 'พร้อมเพย์ QR' : 'โอนผ่านธนาคาร'}
                    </p>
                  </td>

                  {/* Slip & Logistics Status */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {order.status === 'payment_verifying' && (
                        <button
                          onClick={() => setSelectedOrderForSlip(order)}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1 hover:scale-105 transition-transform"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>ตรวจสลิปโอน (คลิก)</span>
                        </button>
                      )}

                      {order.payment_status === 'paid' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-block">
                          ✓ ยืนยันยอดแล้ว
                        </span>
                      )}

                      {order.tracking_number ? (
                        <div className="pt-1">
                          <p className="text-[10px] font-mono font-bold text-emerald-600 flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            <span>{order.tracking_number}</span>
                          </p>
                          <p className="text-[9px] text-zinc-400 uppercase">
                            {order.courier_code?.replace('_', ' ')}
                          </p>
                        </div>
                      ) : (
                        order.payment_status === 'paid' && (
                          <span className="text-[10px] text-zinc-400 block pt-0.5">
                            รอจัดส่งพัสดุ
                          </span>
                        )
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Check Slip Button */}
                      {order.slip_url && (
                        <button
                          onClick={() => setSelectedOrderForSlip(order)}
                          className="p-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="ดูและตรวจสอบสลิป"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {/* Print Waybill (ใบปะหน้าพัสดุ) */}
                      <button
                        onClick={() => setSelectedOrderForWaybill(order)}
                        className="p-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        title="พิมพ์ใบปะหน้าพัสดุ 100x150 มม."
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Dispatch Shipment Button */}
                      {!order.tracking_number && (
                        <button
                          onClick={() => setDispatchModalOrder(order)}
                          className="px-2.5 py-1 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-lg text-[10px] font-bold hover:opacity-90 flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3" />
                          <span>จัดส่ง</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Verification Modal */}
      {selectedOrderForSlip && (
        <SlipVerificationModal
          order={selectedOrderForSlip}
          isOpen={Boolean(selectedOrderForSlip)}
          onClose={() => setSelectedOrderForSlip(null)}
          onVerify={verifyPaymentSlip}
        />
      )}

      {/* Waybill Printing Modal (ใบปะหน้าพัสดุ) */}
      {selectedOrderForWaybill && (
        <WaybillPrintModal
          order={selectedOrderForWaybill}
          isOpen={Boolean(selectedOrderForWaybill)}
          onClose={() => setSelectedOrderForWaybill(null)}
        />
      )}

      {/* Dispatch Shipment Modal (Couriers Integration) */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-zinc-950 dark:text-white" />
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  ออกเลขพัสดุและจัดส่ง #{dispatchModalOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setDispatchModalOrder(null)}
                className="p-1 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              เลือกระบบขนส่งพันธมิตร เพื่อสร้างเลขพัสดุ (Tracking Number) อัตโนมัติและส่งการแจ้งเตือนทาง LINE
            </p>

            <div className="space-y-2">
              {(Object.keys(COURIER_PROVIDERS) as CourierCode[]).map((cCode) => {
                const c = COURIER_PROVIDERS[cCode];
                return (
                  <div
                    key={cCode}
                    onClick={() => setSelectedCourier(cCode)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedCourier === cCode
                        ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800'
                        : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{c.nameTh}</p>
                      <p className="text-[10px] text-zinc-400">{c.nameEn} • Call: {c.hotline}</p>
                    </div>
                    {selectedCourier === cCode && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDispatchModalOrder(null)}
                className="flex-1 py-2.5 text-xs font-bold border border-zinc-200 dark:border-zinc-700 rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={dispatching}
                onClick={handleDispatch}
                className="flex-1 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5"
              >
                <span>{dispatching ? 'กำลังออกเลข...' : 'ยืนยันออกเลขพัสดุ'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

