'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '../lib/store/data';
import { ProductCard } from '../components/ProductCard';
import { Search, Sparkles, ArrowRight, Smartphone, ShieldCheck, Zap } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'สินค้าทั้งหมด' },
  { id: 'cat_living', name: 'Minimal Living' },
  { id: 'cat_workspace', name: 'Desk & Workspace' },
  { id: 'cat_apparel', name: 'Essential Apparel' },
  { id: 'cat_coffee', name: 'Artisanal Coffee' },
];

export default function HomePage() {
  const { products } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((prod) => {
    const matchesCat = selectedCategory === 'all' || prod.category_id === selectedCategory;
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION (Modern & Minimal Aesthetic) */}
      <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <Sparkles className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />
              <span>Universal E-Commerce: Web, iOS, Android & Vercel</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.1]">
              ความเรียบง่ายเหนือกาลเวลา <br className="hidden sm:block" />
              <span className="text-zinc-400 font-light">เพื่อทุกมิติของการใช้ชีวิต</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              คอลเลกชันที่ผสานดีไซน์ Modern & Minimal ฟังก์ชันที่แม่นยำ พร้อมระบบสั่งซื้อด่วน ตรวจสอบยอดโอนทันที และออกใบกำกับภาษีได้ทั้งบุคคลธรรมดาและนิติบุคคล
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="px-6 py-3.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-sm font-semibold rounded-full hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
              >
                <span>เลือกชมสินค้า</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/orders"
                className="px-6 py-3.5 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-semibold rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                ตรวจสอบสถานะพัสดุ
              </Link>
            </div>
          </div>
        </div>

        {/* Ambient Minimal Gradient */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-zinc-200 dark:bg-zinc-800/30 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* FILTER & PRODUCT CATALOG */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสินค้า, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-2">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
            <p className="text-xs text-zinc-500">ลองเปลี่ยนคำค้นหา หรือเลือกดูหมวดหมู่อื่นๆ</p>
          </div>
        )}
      </section>

      {/* REACT NATIVE APP & MULTI-PLATFORM HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              CROSS-PLATFORM REACT NATIVE
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              สัมผัสประสบการณ์บนทุกอุปกรณ์ <br />
              Web, iPhone, iPad และ Android
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              พัฒนาด้วย React Native & Expo ร่วมกับ Next.js ฐานข้อมูลเชื่อมต่อ Supabase แบบเรียลไทม์ ตรวจสอบสลิป รวดเร็ว ปลอดภัย และพร้อมสำหรับการจัดส่งทันที
            </p>
            <div className="pt-2 flex items-center gap-6 text-xs text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                iOS & Android Ready
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Vercel Edge Hosted
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                Supabase Auth & DB
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-mono text-2xl font-black">
              APP
            </div>
            <span className="text-xs text-zinc-400">React Native Native App</span>
          </div>
        </div>
      </section>
    </div>
  );
}

