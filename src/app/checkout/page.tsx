'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../lib/store/cart';
import { useAuth } from '../../lib/store/auth';
import { useData } from '../../lib/store/data';
import { PromptPayQR } from '../../components/PromptPayQR';
import { convertImageToWebp } from '../../lib/webp-converter';
import { AccountType, PaymentMethod, ShippingAddress, TaxInvoiceInfo } from '../../supabase/types';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Upload,
  Check,
  Trash2,
  ArrowRight,
  Receipt,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, totalAmount, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useData();

  // Customer & Shipping Form
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [postalCode, setPostalCode] = useState('10110');

  // Tax Invoice Form
  const [taxInvoiceRequired, setTaxInvoiceRequired] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>(user?.account_type || 'individual');
  const [taxNameOrCompany, setTaxNameOrCompany] = useState(
    user?.company_name || user?.full_name || ''
  );
  const [taxId, setTaxId] = useState(user?.tax_id || '');
  const [branchId, setBranchId] = useState(user?.branch_id || '00000');
  const [taxAddress, setTaxAddress] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay');
  const [slipUrl, setSlipUrl] = useState<string>('');
  const [slipTransferredAmount, setSlipTransferredAmount] = useState<number>(totalAmount);
  const [convertingSlip, setConvertingSlip] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Prepopulate saved default address if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ecom_default_address');
      if (saved) {
        const addr = JSON.parse(saved);
        if (addr.address_line1) setAddressLine1(addr.address_line1);
        if (addr.subdistrict) setSubdistrict(addr.subdistrict);
        if (addr.district) setDistrict(addr.district);
        if (addr.province) setProvince(addr.province);
        if (addr.postal_code) setPostalCode(addr.postal_code);
        if (addr.phone && !customerPhone) setCustomerPhone(addr.phone);
        if (addr.recipient_name && !customerName) setCustomerName(addr.recipient_name);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    setSlipTransferredAmount(totalAmount);
  }, [totalAmount]);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">ไม่มีสินค้าในตะกร้าของคุณ</h2>
        <p className="text-xs text-zinc-500">เลือกสินค้าจากหน้าหลักเพื่อเริ่มต้นสั่งซื้อ</p>
        <Link
          href="/"
          className="inline-flex px-6 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full text-xs font-semibold"
        >
          กลับไปเลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  // Handle Bank Transfer Slip Upload & Auto-conversion to .webp
  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setConvertingSlip(true);
    try {
      const converted = await convertImageToWebp(file, 0.85);
      setSlipUrl(converted.previewUrl);
      setSlipTransferredAmount(totalAmount);
    } catch (err) {
      console.error(err);
    } finally {
      setConvertingSlip(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const shippingAddress: ShippingAddress = {
        recipient_name: customerName,
        phone: customerPhone,
        address_line1: addressLine1,
        subdistrict,
        district,
        province,
        postal_code: postalCode,
      };

      const taxInvoiceData: TaxInvoiceInfo | undefined = taxInvoiceRequired
        ? {
            account_type: accountType,
            name_or_company: taxNameOrCompany,
            tax_id: taxId,
            branch_id: branchId,
            address: taxAddress || `${addressLine1} ${subdistrict} ${district} ${province} ${postalCode}`,
            phone: customerPhone,
          }
        : undefined;

      const newOrder = await createOrder({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        subtotal,
        shipping_fee: shippingFee,
        discount: 0,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        tax_invoice_required: taxInvoiceRequired,
        tax_invoice_data: taxInvoiceData,
        items,
        slip_url: slipUrl || undefined,
        slip_transferred_amount: slipUrl ? slipTransferredAmount : undefined,
      });

      clearCart();
      router.push(`/orders/${newOrder.id}`);
    } catch (err) {
      console.error('Error placing order', err);
      alert('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          ยืนยันคำสั่งซื้อ (Express Checkout)
        </h1>
        <p className="text-xs text-zinc-500">
          กรอกที่อยู่จัดส่ง เลือกวิธีชำระเงิน และแนบหลักฐานการโอนได้ทันที
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Contact & Delivery Address */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>1. ข้อมูลผู้สั่งซื้อและที่อยู่จัดส่ง</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">ชื่อผู้รับ</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="เช่น สมชาย วงศ์สวัสดิ์"
                  className="w-full mt-1 px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="เช่น 0812345678"
                  className="w-full mt-1 px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">อีเมล (สำหรับรับใบเสร็จและเลขพัสดุ)</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full mt-1 px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">บ้านเลขที่, ถนน, อาคาร/หมู่บ้าน</label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="เช่น 123/45 ซอยสุขุมวิท 71"
                className="w-full mt-1 px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-zinc-500">แขวง/ตำบล</label>
                <input
                  type="text"
                  required
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  placeholder="พระโขนงเหนือ"
                  className="w-full mt-1 px-2.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-zinc-500">เขต/อำเภอ</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="วัฒนา"
                  className="w-full mt-1 px-2.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-zinc-500">จังหวัด</label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full mt-1 px-2.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-zinc-500">รหัสไปรษณีย์</label>
                <input
                  type="text"
                  maxLength={5}
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full mt-1 px-2.5 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tax Invoice (ใบกำกับภาษี) Toggle */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-zinc-950 dark:text-white" />
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  2. ขอรับใบกำกับภาษีเต็มรูป (Tax Invoice)
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={taxInvoiceRequired}
                  onChange={(e) => setTaxInvoiceRequired(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-950 dark:peer-checked:bg-white dark:after:bg-zinc-950" />
              </label>
            </div>

            {taxInvoiceRequired && (
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 animate-in fade-in-50">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="tax_type"
                      checked={accountType === 'individual'}
                      onChange={() => setAccountType('individual')}
                    />
                    <span>บุคคลธรรมดา</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="tax_type"
                      checked={accountType === 'juristic'}
                      onChange={() => setAccountType('juristic')}
                    />
                    <span>นิติบุคคล (บริษัท / หจก.)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-500">
                      {accountType === 'juristic' ? 'ชื่อบริษัท / นิติบุคคล' : 'ชื่อ - นามสกุล'}
                    </label>
                    <input
                      type="text"
                      required={taxInvoiceRequired}
                      value={taxNameOrCompany}
                      onChange={(e) => setTaxNameOrCompany(e.target.value)}
                      placeholder={accountType === 'juristic' ? 'บริษัท ตัวอย่าง จำกัด' : 'สมชาย วงศ์สวัสดิ์'}
                      className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-500">
                      เลขประจำตัวผู้เสียภาษี 13 หลัก
                    </label>
                    <input
                      type="text"
                      maxLength={13}
                      required={taxInvoiceRequired}
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="0105562098123"
                      className="w-full mt-1 px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                    />
                  </div>
                </div>

                {accountType === 'juristic' && (
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-500">
                      รหัสสาขา (00000 = สำนักงานใหญ่)
                    </label>
                    <input
                      type="text"
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      placeholder="00000"
                      className="w-full mt-1 px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Payment Method & Slip Upload */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-6 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>3. เลือกวิธีการชำระเงิน</span>
            </h3>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('promptpay')}
                className={`py-3 px-2 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'promptpay'
                    ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 opacity-70'
                }`}
              >
                <QrCode className="w-5 h-5 mx-auto mb-1 text-zinc-900 dark:text-white" />
                <span className="text-[11px] font-bold block">พร้อมเพย์ QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`py-3 px-2 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 opacity-70'
                }`}
              >
                <Building className="w-5 h-5 mx-auto mb-1 text-zinc-900 dark:text-white" />
                <span className="text-[11px] font-bold block">โอนธนาคาร</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`py-3 px-2 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 opacity-70'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-zinc-900 dark:text-white" />
                <span className="text-[11px] font-bold block">เก็บเงินปลายทาง</span>
              </button>
            </div>

            {/* Dynamic PromptPay QR Display */}
            {paymentMethod === 'promptpay' && (
              <div className="pt-2">
                <PromptPayQR amount={totalAmount} />
              </div>
            )}

            {/* Bank Transfer Details */}
            {paymentMethod === 'bank_transfer' && (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl space-y-2 text-xs">
                <p className="font-bold text-zinc-900 dark:text-white">บัญชีรับโอนเงิน:</p>
                <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1.5">
                  <span className="text-zinc-500">ธนาคารกสิกรไทย (KBANK):</span>
                  <span className="font-mono font-bold">012-3-45678-9</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1.5">
                  <span className="text-zinc-500">ธนาคารไทยพาณิชย์ (SCB):</span>
                  <span className="font-mono font-bold">987-6-54321-0</span>
                </div>
                <p className="text-[11px] text-zinc-400">ชื่อบัญชี: บจก. มินิมอล สตูดิโอ (MINIMAL STUDIO CO., LTD.)</p>
              </div>
            )}

            {/* SLIP UPLOAD ZONE (With auto .webp converter!) */}
            {paymentMethod !== 'cod' && (
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>แนบสลิปหลักฐานการโอน (เพื่อตรวจสอบยอดทันที)</span>
                  </label>
                  <span className="text-[10px] text-zinc-400">แปลงเป็น .webp อัตโนมัติ</span>
                </div>

                {slipUrl ? (
                  <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-zinc-200 dark:border-zinc-700">
                      <img src={slipUrl} alt="Slip Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> แนบสลิปเรียบร้อยแล้ว (.webp)
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[11px] text-zinc-500">ยอดที่โอน:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={slipTransferredAmount}
                          onChange={(e) => setSlipTransferredAmount(parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-0.5 text-xs font-mono font-bold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded"
                        />
                        <span className="text-[11px] text-zinc-500">บาท</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSlipUrl('')}
                      className="p-2 text-zinc-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 text-center cursor-pointer hover:border-zinc-400 block bg-zinc-50/50 dark:bg-zinc-900/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlipUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-1">
                      {convertingSlip ? (
                        <div className="w-5 h-5 border-2 border-zinc-950 dark:border-white border-t-transparent rounded-full animate-spin my-2" />
                      ) : (
                        <Upload className="w-6 h-6 text-zinc-400 stroke-[1.5]" />
                      )}
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {convertingSlip ? 'กำลังแปลงเป็น WebP...' : 'คลิกเพื่อเลือกไฟล์รูปภาพสลิป'}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        รองรับรูปสลิปจากทุกธนาคาร (ระบบจะลดขนาดไฟล์และแปลงเป็น .webp ให้อัตโนมัติ)
                      </p>
                    </div>
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-6 shadow-xs sticky top-24">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              สรุปรายการสั่งซื้อ ({items.length} รายการ)
            </h3>

            {/* Items List */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-72 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.product.id} className="py-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    <img
                      src={it.product.images[0]}
                      alt={it.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">
                      {it.product.title}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      ฿{it.product.price.toLocaleString()} x {it.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-zinc-950 dark:text-white">
                    ฿{(it.product.price * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Calculation */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>ยอดรวมสินค้า</span>
                <span className="font-mono">฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>ค่าจัดส่ง (Flash Express / EMS)</span>
                <span className="font-mono">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">ฟรี (ส่งฟรีเมื่อช้อปครบ ฿1,500)</span>
                  ) : (
                    `฿${shippingFee}`
                  )}
                </span>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between text-base font-black text-zinc-950 dark:text-white">
                <span>ยอดชำระทั้งสิ้น</span>
                <span className="text-xl">฿{totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
            >
              <span>{submitting ? 'กำลังบันทึกคำสั่งซื้อ...' : 'ยืนยันและสั่งซื้อสินค้า'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-zinc-400">
              เมื่อกดสั่งซื้อ ระบบจะส่งข้อความแจ้งเตือนผ่าน LINE อัตโนมัติ และแสดงขั้นตอนการติดตามสถานะ
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

