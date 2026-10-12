'use client';

import React, { useEffect, useRef } from 'react';
import { Order } from '../supabase/types';
import { COURIER_PROVIDERS } from '../lib/courier-api';
import QRCode from 'qrcode';
import { Printer, X, Download, ShieldCheck, AlertTriangle } from 'lucide-react';

interface WaybillPrintModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const WaybillPrintModal: React.FC<WaybillPrintModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const courierInfo = order.courier_code ? COURIER_PROVIDERS[order.courier_code] : COURIER_PROVIDERS['flash_express'];
  const trackingNumber = order.tracking_number || 'TH0129384819F';

  useEffect(() => {
    if (!qrRef.current || !isOpen) return;
    QRCode.toCanvas(
      qrRef.current,
      trackingNumber,
      {
        width: 110,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      },
      (error) => {
        if (error) console.error(error);
      }
    );
  }, [trackingNumber, isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Action Header (Hidden during Print) */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between no-print">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              พิมพ์ใบปะหน้าพัสดุ (Shipping Waybill)
            </h3>
            <p className="text-[11px] text-zinc-400">ขนาดมาตรฐาน 100 x 150 มม. (Thermal Label) และ A4</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ใบปะหน้า</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE WAYBILL CONTAINER (Target for @media print) */}
        <div className="p-6 bg-zinc-100 dark:bg-zinc-950 flex justify-center">
          <div className="printable-waybill w-[100mm] min-h-[148mm] bg-white text-black p-4 border border-black shadow-lg rounded-none flex flex-col justify-between text-[11px] leading-tight font-sans">
            {/* Courier Header Bar */}
            <div className="border-b-2 border-black pb-2 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold tracking-tight uppercase">
                  {courierInfo.nameEn}
                </span>
                <p className="text-[9px] font-medium text-gray-700">
                  {courierInfo.nameTh} • Call: {courierInfo.hotline}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold bg-black text-white px-2 py-0.5 rounded-xs">
                  STD-EXPRESS
                </span>
                <p className="text-[8px] text-gray-600 mt-0.5">ใบปะหน้าอัตโนมัติ</p>
              </div>
            </div>

            {/* Tracking Barcode & QR Code Section */}
            <div className="py-2 border-b-2 border-black flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-[9px] uppercase tracking-wider font-semibold text-gray-500">
                  TRACKING NUMBER (เลขพัสดุ)
                </p>
                <p className="text-lg font-mono font-black tracking-wider my-0.5">
                  {trackingNumber}
                </p>
                {/* CSS Barcode Mockup */}
                <div className="h-9 w-full bg-[repeating-linear-gradient(90deg,black_0,black_2px,white_2px,white_4px,black_4px,black_7px,white_7px,white_8px)] opacity-95 my-1" />
                <p className="text-[9px] font-mono text-center tracking-widest text-gray-700">
                  *{trackingNumber}*
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center">
                <canvas ref={qrRef} className="w-[85px] h-[85px]" />
                <span className="text-[8px] font-mono mt-0.5">SCAN TO TRACK</span>
              </div>
            </div>

            {/* Sender & Recipient Addresses */}
            <div className="py-2 border-b-2 border-black grid grid-cols-1 gap-2">
              {/* Sender */}
              <div className="border-b border-gray-300 pb-1.5">
                <p className="text-[9px] font-bold uppercase text-gray-600">ผู้ส่ง (FROM):</p>
                <p className="font-bold">MINIMAL STUDIO CO., LTD. (คลังสินค้ากลาง)</p>
                <p className="text-[10px] text-gray-700">
                  88 ถ.สุขุมวิท 71 พระโขนงเหนือ วัฒนา กรุงเทพฯ 10110
                </p>
                <p className="text-[10px] font-mono">โทร: 02-888-9999</p>
              </div>

              {/* Recipient (Highlighted Big) */}
              <div className="pt-1 bg-gray-50 p-2 border border-gray-200">
                <p className="text-[10px] font-black uppercase text-gray-800">ผู้รับ (TO):</p>
                <p className="text-sm font-black text-black">
                  {order.shipping_address?.recipient_name || order.customer_name}
                </p>
                <p className="text-xs font-bold text-black mt-0.5">
                  {order.shipping_address?.address_line1}
                </p>
                <p className="text-xs text-black">
                  {order.shipping_address?.subdistrict ? `แขวง/ตำบล: ${order.shipping_address.subdistrict}` : ''}{' '}
                  {order.shipping_address?.district ? `เขต/อำเภอ: ${order.shipping_address.district}` : ''}{' '}
                  {order.shipping_address?.province}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-300">
                  <span className="text-xs font-bold font-mono">
                    โทร: {order.shipping_address?.phone || order.customer_phone}
                  </span>
                  {/* Huge Postal Code Box */}
                  <span className="text-base font-black font-mono bg-black text-white px-3 py-0.5 rounded-xs tracking-wider">
                    {order.shipping_address?.postal_code || '10110'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tax Invoice & COD Info */}
            <div className="py-2 border-b border-black grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <p className="text-[9px] font-bold text-gray-600">ประเภทคำสั่งซื้อ:</p>
                <p className="font-bold">
                  {order.payment_method === 'cod' ? 'เก็บเงินปลายทาง (COD)' : 'ชำระเงินแล้ว (PAID)'}
                </p>
                <p className="text-[9px] text-gray-500 font-mono">ORD: {order.order_number}</p>
              </div>
              <div className="border-l border-gray-300 pl-2">
                <p className="text-[9px] font-bold text-gray-600">เอกสารกำกับ:</p>
                {order.tax_invoice_required ? (
                  <p className="font-bold text-black bg-yellow-200 px-1 inline-block">
                    ★ แนบใบกำกับภาษี ({order.tax_invoice_data?.account_type === 'juristic' ? 'นิติบุคคล' : 'บุคคลธรรมดา'})
                  </p>
                ) : (
                  <p className="text-gray-500">ใบเสร็จรับเงินมาตรฐาน</p>
                )}
              </div>
            </div>

            {/* Item List Summary */}
            <div className="py-1 border-b border-black">
              <p className="text-[8px] font-bold uppercase text-gray-500">รายการสินค้า ({order.items?.length || 1} ชิ้น):</p>
              <div className="text-[9px] space-y-0.5 mt-0.5">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate max-w-[200px]">• {item.title}</span>
                    <span className="font-bold">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Warning & Fragile mark */}
            <div className="pt-2 flex items-center justify-between text-[9px]">
              <div className="flex items-center gap-1 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-black" />
                <span>ระวังแตก (FRAGILE) ห้ามโยน</span>
              </div>
              <div className="text-right text-[8px] text-gray-500 font-mono">
                {new Date().toLocaleDateString('th-TH')} | PRINTED BY SYSTEM
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

