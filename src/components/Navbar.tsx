'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Shield, ArrowRightLeft, Menu, X, CheckCircle2 } from 'lucide-react';
import { useCart } from '../lib/store/cart';
import { useAuth } from '../lib/store/auth';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, isAdmin, switchRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isNavActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm tracking-tighter">
                E
              </span>
              <div className="flex flex-col">
                <span className="font-semibold tracking-tight text-lg text-zinc-950 dark:text-white leading-tight">
                  MINIMAL<span className="text-zinc-400 font-light ml-0.5">STUDIO</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                  Universal E-Commerce
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-zinc-950 dark:hover:text-white ${
                  isNavActive('/') ? 'text-zinc-950 dark:text-white font-semibold' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                หน้าแรก
              </Link>
              <Link
                href="/orders"
                className={`text-sm font-medium transition-colors hover:text-zinc-950 dark:hover:text-white ${
                  isNavActive('/orders') ? 'text-zinc-950 dark:text-white font-semibold' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                ติดตามสถานะคำสั่งซื้อ
              </Link>
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </Link>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Pill (Great for Pair Programming & Testing) */}
            <div className="hidden lg:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full text-xs border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => switchRole('customer')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  !isAdmin
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                ลูกค้า (Customer)
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  isAdmin
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                แอดมิน (Admin)
              </button>
            </div>

            {/* Cart Button */}
            <Link
              href="/checkout"
              className="relative p-2.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[11px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                <Link
                  href="/onboarding"
                  className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white"
                  title="ข้อมูลผู้ใช้และใบกำกับภาษี"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden border border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium text-xs max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs font-semibold px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full hover:opacity-90 transition-opacity"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-zinc-800 dark:text-zinc-200"
          >
            หน้าแรก (Storefront)
          </Link>
          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-zinc-800 dark:text-zinc-200"
          >
            ติดตามสถานะคำสั่งซื้อ
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-zinc-800 dark:text-zinc-200"
          >
            ระบบจัดการหลังบ้าน (Admin)
          </Link>
          <Link
            href="/onboarding"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-zinc-800 dark:text-zinc-200"
          >
            ตั้งค่าโปรไฟล์ & ใบกำกับภาษี
          </Link>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500">สลับโหมด:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  switchRole('customer');
                  setMobileMenuOpen(false);
                }}
                className={`text-xs px-3 py-1 rounded-full ${!isAdmin ? 'bg-zinc-900 text-white' : 'bg-zinc-100'}`}
              >
                ลูกค้า
              </button>
              <button
                onClick={() => {
                  switchRole('admin');
                  setMobileMenuOpen(false);
                }}
                className={`text-xs px-3 py-1 rounded-full ${isAdmin ? 'bg-zinc-900 text-white' : 'bg-zinc-100'}`}
              >
                แอดมิน
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

