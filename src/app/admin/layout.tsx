'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/store/auth';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Mail,
  Share2,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin', label: 'ภาพรวมระบบ (Overview)', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'คำสั่งซื้อ & ตรวจสลิป', icon: ShoppingBag },
  { href: '/admin/products', label: 'สินค้า & อัพโหลด WebP', icon: Package },
  { href: '/admin/users', label: 'จัดการผู้ใช้ & ข้อมูลภาษี', icon: Users },
  { href: '/admin/marketing', label: 'การตลาดผ่าน Gmail', icon: Mail },
  { href: '/admin/integrations', label: 'API (Shopee, ขนส่ง, LINE)', icon: Share2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, switchRole } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Admin Top Banner */}
      <div className="bg-zinc-950 text-white border-b border-zinc-800 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[11px]">
            ADMIN CONSOLE • MINIMAL STUDIO
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่หน้าร้าน (Storefront)</span>
          </Link>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400 font-mono text-[11px]">{user?.email || 'admin'}</span>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-8 scrollbar-none">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Admin Content Area */}
        {children}
      </div>
    </div>
  );
}

