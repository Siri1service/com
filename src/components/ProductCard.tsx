'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '../supabase/types';
import { useCart } from '../lib/store/cart';
import { ShoppingBag, Check } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, items } = useCart();
  const [added, setAdded] = React.useState(false);

  const isInCart = items.some((it) => it.product.id === product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;
  const isOutOfStock = product.stock_quantity === 0 || product.status === 'out_of_stock';

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-minimal transition-all duration-300">
      {/* Product Image Box */}
      <Link href={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs">
              SALE
            </span>
          )}
          {isLowStock && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/90 text-white backdrop-blur-xs">
              เหลือเพียง {product.stock_quantity} ชิ้น
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500 text-white">
              สินค้าหมดชั่วคราว
            </span>
          )}
        </div>

        {/* Shopee Tag (if synced) */}
        {product.shopee_item_id && (
          <div className="absolute bottom-2.5 left-3">
            <span className="text-[9px] font-medium tracking-tight px-1.5 py-0.5 rounded bg-white/90 dark:bg-zinc-900/90 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900 backdrop-blur-xs">
              Shopee Synced
            </span>
          </div>
        )}

        {/* Quick Add Button on Hover */}
        {!isOutOfStock && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
            title="เพิ่มลงตะกร้าทันที"
            aria-label="Add to Cart"
          >
            {added ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
            {product.sku}
          </p>
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Stock Status */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-zinc-950 dark:text-white">
              ฿{product.price.toLocaleString()}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs text-zinc-400 line-through">
                ฿{product.compare_at_price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="text-[11px] font-medium text-zinc-400">
            {isOutOfStock ? (
              <span className="text-rose-500">หมด</span>
            ) : (
              <span>คลัง: {product.stock_quantity}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

