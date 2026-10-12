'use client';

import React, { useState } from 'react';
import { useData } from '../../../lib/store/data';
import { UserProfile, AccountType, UserRole } from '../../../supabase/types';
import {
  Users,
  Edit,
  Shield,
  Building2,
  User,
  Search,
  CheckCircle2,
  XCircle,
  X,
  Save,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { users, updateUserByAdmin } = useData();
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<(UserProfile & { orders_count: number; total_spent: number }) | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [taxId, setTaxId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [branchId, setBranchId] = useState('00000');
  const [role, setRole] = useState<UserRole>('customer');
  const [status, setStatus] = useState<'active' | 'suspended'>('active');

  const openEditModal = (u: any) => {
    setEditingUser(u);
    setFullName(u.full_name || '');
    setEmail(u.email);
    setPhone(u.phone || '');
    setAccountType(u.account_type || 'individual');
    setTaxId(u.tax_id || '');
    setCompanyName(u.company_name || '');
    setBranchId(u.branch_id || '00000');
    setRole(u.role || 'customer');
    setStatus(u.status || 'active');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUserByAdmin(editingUser.id, {
      full_name: fullName,
      email,
      phone,
      account_type: accountType,
      tax_id: taxId,
      company_name: accountType === 'juristic' ? companyName : undefined,
      branch_id: branchId,
      role,
      status,
    });

    setEditingUser(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.company_name && u.company_name.toLowerCase().includes(search.toLowerCase())) ||
      (u.tax_id && u.tax_id.includes(search))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
            จัดการสมาชิกและข้อมูลภาษี (User & Tax Records)
          </h1>
          <p className="text-xs text-zinc-500">
            แก้ไขข้อมูลผู้ใช้ สลับประเภทบุคคล/นิติบุคคล ตรวจสอบจำนวนออเดอร์ และสถานะการใช้งาน
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อ, อีเมล, เลขประจำตัวผู้เสียภาษี..."
          className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                <th className="py-3.5 px-4">ผู้ใช้งาน</th>
                <th className="py-3.5 px-4">ประเภทบัญชี / ภาษี</th>
                <th className="py-3.5 px-4">จำนวนออเดอร์</th>
                <th className="py-3.5 px-4">ยอดใช้จ่ายสะสม</th>
                <th className="py-3.5 px-4">สถานะ & สิทธิ์</th>
                <th className="py-3.5 px-4 text-right">แก้ไข</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt={u.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">{u.full_name}</p>
                        <p className="text-[10px] text-zinc-400">{u.email}</p>
                        {u.phone && <p className="text-[10px] text-zinc-500 font-mono">โทร: {u.phone}</p>}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {u.account_type === 'juristic' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 rounded-md">
                          <Building2 className="w-3 h-3" /> นิติบุคคล
                        </span>
                        <p className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 mt-1">
                          {u.company_name || '-'}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-400">
                          Tax ID: {u.tax_id || '-'} (สาขา: {u.branch_id || '00000'})
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded-md">
                          <User className="w-3 h-3" /> บุคคลธรรมดา
                        </span>
                        {u.tax_id && (
                          <p className="text-[10px] font-mono text-zinc-400 mt-1">
                            บัตร ปชช.: {u.tax_id}
                          </p>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-zinc-900 dark:text-white font-mono">
                      {u.orders_count || 0} ออเดอร์
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-black text-zinc-950 dark:text-white">
                      ฿{(u.total_spent || 0).toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {u.status === 'active' ? 'เปิดใช้งาน' : 'ระงับชั่วคราว'}
                      </span>
                      {u.role === 'admin' && (
                        <span className="text-[9px] font-mono font-bold text-amber-600">
                          [ผู้ดูแลระบบ]
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      title="แก้ไขข้อมูลผู้ใช้"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                แก้ไขข้อมูลผู้ใช้งาน #{editingUser.email}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">ชื่อ - สกุล</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Account Type Toggle */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  ประเภทบัญชี
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="u_acc_type"
                      checked={accountType === 'individual'}
                      onChange={() => setAccountType('individual')}
                    />
                    <span>บุคคลธรรมดา</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="u_acc_type"
                      checked={accountType === 'juristic'}
                      onChange={() => setAccountType('juristic')}
                    />
                    <span>นิติบุคคล</span>
                  </label>
                </div>
              </div>

              {accountType === 'juristic' && (
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    ชื่อบริษัท / นิติบุคคล
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    เลขประจำตัวผู้เสียภาษี 13 หลัก
                  </label>
                  <input
                    type="text"
                    maxLength={13}
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    รหัสสาขา
                  </label>
                  <input
                    type="text"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">สิทธิ์ผู้ใช้</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  >
                    <option value="customer">ลูกค้าทั่วไป (Customer)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">สถานะการใช้งาน</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  >
                    <option value="active">เปิดใช้งาน (Active)</option>
                    <option value="suspended">ระงับการใช้งาน (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold hover:opacity-90"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

