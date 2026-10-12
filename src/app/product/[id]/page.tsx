'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useData } from '../../../lib/store/data';
import { useCart } from '../../../lib/store/cart';
import { SeoSchema } from '../../../components/SeoSchema';
import {
  ShoppingBag,
  Check,
  Truck,
  Receipt,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Share2,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products } = useData();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">ไม่พบสินค้าที่คุณค้นหา</h2>
        <p className="text-sm text-zinc-500">สินค้านี้อาจถูกลบหรือเปลี่ยนรหัสสินค้าไปแล้ว</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-zinc-950 text-white rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าแรก</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;
  const isOutOfStock = product.stock_quantity === 0 || product.status === 'out_of_stock';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SeoSchema type="product" data={product} />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-200">
          หน้าแรก
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-800 dark:text-zinc-200 font-medium truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Images Column */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs relative">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {isLowStock && (
              <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                เหลือเพียง {product.stock_quantity} ชิ้นสุดท้าย
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-zinc-950 dark:border-white ring-2 ring-zinc-200 dark:ring-zinc-800'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                SKU: {product.sku}
              </span>
              {product.shopee_item_id && (
                <span className="text-[11px] font-medium text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
                  Shopee Synced • {product.shopee_item_id}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-zinc-950 dark:text-white">
                ฿{product.price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <>
                  <span className="text-sm text-zinc-400 line-through">
                    ฿{product.compare_at_price.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    ลด {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Level Status */}
            <div className="pt-2 text-xs">
              {isOutOfStock ? (
                <span className="font-semibold text-rose-600">● สินค้าหมดชั่วคราว</span>
              ) : (
                <span className="font-medium text-emerald-600">
                  ● มีสินค้าพร้อมจัดส่งในคลัง ({product.stock_quantity} ชิ้น)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {product.description}
            </p>
          </div>

          {/* Quantity & Buy Actions */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">จำนวน:</span>
                <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold font-mono min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3.5 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-2xl border-2 border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-40"
              >
                {added ? <Check className="w-4 h-4 text-emerald-600" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{added ? 'เพิ่มลงตะกร้าแล้ว' : 'เพิ่มลงตะกร้า'}</span>
              </button>

              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md disabled:opacity-40"
              >
                <span>สั่งซื้อทันที (Express Checkout)</span>
              </button>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-zinc-900 dark:text-white" />
              <span>จัดส่งด่วนผ่าน Flash Express / EMS พร้อมเลขพัสดุเรียลไทม์</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Receipt className="w-4 h-4 text-zinc-900 dark:text-white" />
              <span>ออกใบกำกับภาษีได้ทั้งบุคคลธรรมดา และนิติบุคคลเต็มรูป</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-zinc-900 dark:text-white" />
              <span>ชำระผ่านพร้อมเพย์ QR ตรวจสอบยอดโอนรวดเร็วแม่นยำ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

