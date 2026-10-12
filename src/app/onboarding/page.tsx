'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/store/auth';
import { AccountType } from '../../supabase/types';
import { Building2, User, CheckCircle2, ShieldCheck, MapPin, Receipt, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuth();

  const [accountType, setAccountType] = useState<AccountType>(user?.account_type || 'individual');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [companyName, setCompanyName] = useState(user?.company_name || '');
  const [taxId, setTaxId] = useState(user?.tax_id || '');
  const [branchId, setBranchId] = useState(user?.branch_id || '00000');
  const [addressLine1, setAddressLine1] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [postalCode, setPostalCode] = useState('10110');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await completeOnboarding({
      account_type: accountType,
      full_name: fullName,
      phone,
      company_name: accountType === 'juristic' ? companyName : undefined,
      tax_id: taxId,
      branch_id: branchId,
      shipping_address: {
        recipient_name: fullName,
        phone,
        address_line1: addressLine1,
        subdistrict,
        district,
        province,
        postal_code: postalCode,
      },
    });

    setSaved(true);
    setTimeout(() => {
      router.push('/');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          ตั้งค่าโปรไฟล์และข้อมูลภาษี
        </h1>
        <p className="text-xs text-zinc-500">
          กำหนดประเภทผู้ใช้งาน (บุคคลธรรมดา / นิติบุคคล) รายละเอียดใบกำกับภาษี และที่อยู่จัดส่งเริ่มต้น
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Account Type Card Selection */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>1. ประเภทผู้ใช้งาน</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setAccountType('individual')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                accountType === 'individual'
                  ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800'
                  : 'border-zinc-200 dark:border-zinc-800 opacity-60'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-zinc-950 dark:text-white">บุคคลธรรมดา</span>
                {accountType === 'individual' && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                ผู้ใช้งานทั่วไป สามารถรับใบกำกับภาษีตามเลขประจำตัวประชาชน
              </p>
            </div>

            <div
              onClick={() => setAccountType('juristic')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                accountType === 'juristic'
                  ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800'
                  : 'border-zinc-200 dark:border-zinc-800 opacity-60'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-zinc-950 dark:text-white">นิติบุคคล (บริษัท / หจก.)</span>
                {accountType === 'juristic' && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                สำหรับบริษัท ออกใบกำกับภาษีเต็มรูปพร้อมรหัสสาขาและเลข 13 หลัก
              </p>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            <span>2. รายละเอียดใบกำกับภาษี</span>
          </h3>

          <div className="space-y-3">
            {accountType === 'juristic' && (
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  ชื่อบริษัท / นิติบุคคล (ตาม ภ.พ.20)
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="เช่น บริษัท ตัวอย่าง โซลูชั่นส์ จำกัด"
                  className="w-full mt-1 px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
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
                  required
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="0105562098123"
                  className="w-full mt-1 px-4 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  รหัสสาขา (00000 = สำนักงานใหญ่)
                </label>
                <input
                  type="text"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  placeholder="00000"
                  className="w-full mt-1 px-4 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>3. ที่อยู่สำหรับการจัดส่งพัสดุ</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">ชื่อผู้รับ</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="สมชาย วงศ์สวัสดิ์"
                className="w-full mt-1 px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812345678"
                className="w-full mt-1 px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">ที่อยู่ / อาคาร</label>
            <input
              type="text"
              required
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="123/45 ถนนสุขุมวิท"
              className="w-full mt-1 px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[11px] text-zinc-500">แขวง/ตำบล</label>
              <input
                type="text"
                required
                value={subdistrict}
                onChange={(e) => setSubdistrict(e.target.value)}
                placeholder="พระโขนงเหนือ"
                className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500">เขต/อำเภอ</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="วัฒนา"
                className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500">จังหวัด</label>
              <input
                type="text"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500">รหัสไปรษณีย์</label>
              <input
                type="text"
                maxLength={5}
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <ArrowRight className="w-4 h-4" />}
          <span>{saved ? 'บันทึกสำเร็จ กำลังกลับสู่หน้าแรก...' : 'บันทึกข้อมูลโปรไฟล์'}</span>
        </button>
      </form>
    </div>
  );
}

