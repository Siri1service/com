'use client';

import React, { useState } from 'react';
import { useAuth, OnboardingData } from '../lib/store/auth';
import { AccountType } from '../supabase/types';
import { Building2, User, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, MapPin, Receipt } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [accountType, setAccountType] = useState<AccountType>(user?.account_type || 'individual');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [companyName, setCompanyName] = useState(user?.company_name || '');
  const [taxId, setTaxId] = useState(user?.tax_id || '');
  const [branchId, setBranchId] = useState(user?.branch_id || '00000');
  const [taxAddress, setTaxAddress] = useState('');

  // Shipping Address
  const [recipientName, setRecipientName] = useState(user?.full_name || '');
  const [shippingPhone, setShippingPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [postalCode, setPostalCode] = useState('10110');

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data: OnboardingData = {
        account_type: accountType,
        full_name: fullName,
        phone: phone || shippingPhone,
        company_name: accountType === 'juristic' ? companyName : undefined,
        tax_id: taxId,
        branch_id: branchId,
        shipping_address: {
          recipient_name: recipientName || fullName,
          phone: shippingPhone || phone,
          address_line1: addressLine1,
          subdistrict,
          district,
          province,
          postal_code: postalCode,
        },
      };

      await completeOnboarding(data);
      if (onClose) onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Step Indicator Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              ยินดีต้อนรับ • ตั้งค่าโปรไฟล์ครั้งแรก
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              ขั้นตอน {step} จาก 3
            </span>
          </div>

          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-zinc-950 dark:bg-white h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: บุคคลธรรมดา / นิติบุคคล */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
                เลือกประเภทบัญชีของคุณ
              </h2>
              <p className="text-xs text-zinc-500">
                เพื่อความสะดวกในการออกใบกำกับภาษี และการจัดการคำสั่งซื้ออย่างถูกต้อง
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* บุคคลธรรมดา */}
              <div
                onClick={() => setAccountType('individual')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  accountType === 'individual'
                    ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800/80 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-800 dark:text-white">
                    <User className="w-5 h-5" />
                  </div>
                  {accountType === 'individual' && (
                    <CheckCircle2 className="w-5 h-5 text-zinc-950 dark:text-white" />
                  )}
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-zinc-950 dark:text-white">บุคคลธรรมดา</h4>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    สำหรับบุคคลทั่วไป สามารถออกใบเสร็จรับเงิน หรือใบกำกับภาษีโดยใช้เลขบัตรประชาชนได้
                  </p>
                </div>
              </div>

              {/* นิติบุคคล */}
              <div
                onClick={() => setAccountType('juristic')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  accountType === 'juristic'
                    ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800/80 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-800 dark:text-white">
                    <Building2 className="w-5 h-5" />
                  </div>
                  {accountType === 'juristic' && (
                    <CheckCircle2 className="w-5 h-5 text-zinc-950 dark:text-white" />
                  )}
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-zinc-950 dark:text-white">นิติบุคคล / บริษัท</h4>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    สำหรับบริษัท ห้างหุ้นส่วนจำกัด หน่วยงาน ที่ต้องการใบกำกับภาษีเต็มรูปพร้อมเลข 13 หลัก
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {accountType === 'individual' ? 'ชื่อ - นามสกุล' : 'ชื่อผู้ติดต่อ'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="เช่น สมชาย วงศ์สวัสดิ์"
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 0812345678"
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span>ถัดไป: รายละเอียดใบกำกับภาษี</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: รายละเอียดใบกำกับภาษี */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-zinc-900 dark:text-white" />
                <span>ข้อมูลสำหรับออกใบกำกับภาษี</span>
              </h2>
              <p className="text-xs text-zinc-500">
                {accountType === 'juristic'
                  ? 'กรอกข้อมูลนิติบุคคลตามหนังสือรับรองบริษัท'
                  : 'กรอกเลขประจำตัวผู้เสียภาษี 13 หลัก (เลขบัตรประชาชน)'}
              </p>
            </div>

            <div className="space-y-3">
              {accountType === 'juristic' && (
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    ชื่อบริษัท / นิติบุคคล (ตาม ภ.พ.20)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="เช่น บริษัท มินิมอล โซลูชั่นส์ จำกัด"
                    className="w-full mt-1 px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    เลขประจำตัวผู้เสียภาษี 13 หลัก
                  </label>
                  <input
                    type="text"
                    maxLength={13}
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="เช่น 0105562098123"
                    className="w-full mt-1 px-4 py-2.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    สาขา
                  </label>
                  <input
                    type="text"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    placeholder="00000 (สำนักงานใหญ่)"
                    className="w-full mt-1 px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  ที่อยู่ตามทะเบียนภาษี (สำหรับระบุในใบกำกับภาษี)
                </label>
                <textarea
                  rows={2}
                  value={taxAddress}
                  onChange={(e) => setTaxAddress(e.target.value)}
                  placeholder="เช่น 88/1 อาคารสาทรทาวเวอร์ ชั้น 12 ยานนาวา สาทร กรุงเทพฯ 10120"
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 py-3 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span>ถัดไป: ที่อยู่จัดส่งพัสดุ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ที่อยู่สำหรับการจัดส่ง */}
        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-zinc-900 dark:text-white" />
                <span>ที่อยู่จัดส่งสินค้าเริ่มต้น</span>
              </h2>
              <p className="text-xs text-zinc-500">
                ข้อมูลนี้จะถูกนำไปพิมพ์ลงบนใบปะหน้าพัสดุ (Waybill) เมื่อท่านสั่งซื้อ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  ชื่อผู้รับพัสดุ
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="เช่น สมชาย วงศ์สวัสดิ์"
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  เบอร์โทรศัพท์ผู้รับ
                </label>
                <input
                  type="tel"
                  required
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="เช่น 0812345678"
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                บ้านเลขที่, ซอย, ถนน, อาคาร/หมู่บ้าน
              </label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="เช่น 123/45 คอนโดมิเนียมสุขุมวิท ถ.สุขุมวิท 71"
                className="w-full mt-1 px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                  แขวง / ตำบล
                </label>
                <input
                  type="text"
                  required
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  placeholder="พระโขนงเหนือ"
                  className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                  เขต / อำเภอ
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="วัฒนา"
                  className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                  จังหวัด
                </label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="กรุงเทพฯ"
                  className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                  รหัสไปรษณีย์
                </label>
                <input
                  type="text"
                  maxLength={5}
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10110"
                  className="w-full mt-1 px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-hidden"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 py-3 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'กำลังบันทึก...' : 'บันทึกและเริ่มต้นใช้งาน'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

