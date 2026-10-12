'use client';

import React, { useState } from 'react';
import { Order } from '../supabase/types';
import { X, Check, AlertCircle, ZoomIn, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

interface SlipVerificationModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (orderId: string, approved: boolean, amount?: number) => Promise<void>;
}

export const SlipVerificationModal: React.FC<SlipVerificationModalProps> = ({
  order,
  isOpen,
  onClose,
  onVerify,
}) => {
  const [zoom, setZoom] = useState(false);
  const [verifiedAmount, setVerifiedAmount] = useState<number>(
    order.slip_transferred_amount || order.total_amount
  );
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAction = async (approved: boolean) => {
    setProcessing(true);
    try {
      await onVerify(order.id, approved, verifiedAmount);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const isAmountMatching = Math.abs(verifiedAmount - order.total_amount) < 0.01;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-zinc-900 dark:text-white" />
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                ตรวจสอบยอดโอน (Slip Verification)
              </h3>
              <p className="text-[11px] text-zinc-400">คำสั่งซื้อ #{order.order_number}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slip Image View */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">รูปภาพสลิปโอนเงิน</p>
            <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center min-h-[300px]">
              {order.slip_url ? (
                <>
                  <img
                    src={order.slip_url}
                    alt="Payment Slip"
                    className={`transition-all duration-300 cursor-zoom-in ${
                      zoom ? 'scale-150 object-contain' : 'max-h-[340px] w-auto object-contain'
                    }`}
                    onClick={() => setZoom(!zoom)}
                  />
                  <button
                    onClick={() => setZoom(!zoom)}
                    className="absolute bottom-2 right-2 p-1.5 bg-black/60 text-white rounded-md text-xs flex items-center gap-1 backdrop-blur-xs"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>{zoom ? 'ย่อรูป' : 'ขยายรูป'}</span>
                  </button>
                </>
              ) : (
                <div className="p-6 text-center text-zinc-400 text-xs">
                  ยังไม่มีการแนบสลิปสำหรับคำสั่งซื้อนี้
                </div>
              )}
            </div>
          </div>

          {/* Verification Audit Details */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-2 border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">ยอดที่ต้องชำระตามระบบ:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    ฿{order.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">เวลาที่ลูกค้าแจ้งโอน:</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    {order.slip_transferred_at
                      ? new Date(order.slip_transferred_at).toLocaleString('th-TH')
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">ช่องทาง:</span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {order.payment_method === 'promptpay' ? 'พร้อมเพย์ QR' : 'โอนผ่านธนาคาร'}
                  </span>
                </div>
              </div>

              {/* Amount Matching Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  ยอดเงินที่ตรวจสอบได้จริงจากสลิป (บาท):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">฿</span>
                  <input
                    type="number"
                    step="0.01"
                    value={verifiedAmount}
                    onChange={(e) => setVerifiedAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white outline-hidden font-mono"
                  />
                </div>
                {isAmountMatching ? (
                  <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 inline" />
                    ยอดเงินตรงกับมูลค่าคำสั่งซื้อครบถ้วน
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 inline" />
                    ยอดเงินไม่ตรงกับคำสั่งซื้อ (ต่างกัน ฿{Math.abs(verifiedAmount - order.total_amount).toFixed(2)})
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
              <button
                type="button"
                disabled={processing}
                onClick={() => handleAction(false)}
                className="flex-1 py-2.5 px-3 text-xs font-semibold border border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              >
                ปฏิเสธสลิป
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => handleAction(true)}
                className="flex-2 py-2.5 px-3 text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 rounded-xl flex items-center justify-center gap-1.5 transition-opacity"
              >
                <Check className="w-4 h-4" />
                <span>ยืนยันยอดถูกต้อง (อนุมัติ)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

