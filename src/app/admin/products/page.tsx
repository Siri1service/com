'use client';

import React, { useState } from 'react';
import { useData } from '../../../lib/store/data';
import { Product } from '../../../supabase/types';
import { ImageToWebpUploader } from '../../../components/ImageToWebpUploader';
import { WebpConversionResult } from '../../../lib/webp-converter';
import {
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Share2,
  Search,
  Package,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [comparePrice, setComparePrice] = useState<number | undefined>(undefined);
  const [sku, setSku] = useState('');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [categoryId, setCategoryId] = useState('cat_workspace');
  const [images, setImages] = useState<string[]>([]);
  const [shopeeItemId, setShopeeItemId] = useState('');

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setPrice(1000);
    setComparePrice(undefined);
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setStockQuantity(20);
    setCategoryId('cat_workspace');
    setImages(['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80']);
    setShopeeItemId('');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSlug(p.slug);
    setDescription(p.description);
    setPrice(p.price);
    setComparePrice(p.compare_at_price);
    setSku(p.sku);
    setStockQuantity(p.stock_quantity);
    setCategoryId(p.category_id);
    setImages(p.images);
    setShopeeItemId(p.shopee_item_id || '');
    setModalOpen(true);
  };

  const handleWebpImagesConverted = (results: WebpConversionResult[]) => {
    // Collect preview URLs of the converted .webp files
    const newWebpUrls = results.map((r) => r.previewUrl);
    setImages(newWebpUrls);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        description,
        price,
        compare_at_price: comparePrice,
        sku,
        stock_quantity: stockQuantity,
        category_id: categoryId,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80'],
        shopee_item_id: shopeeItemId || undefined,
        status: stockQuantity === 0 ? 'out_of_stock' : 'active',
      });
    } else {
      addProduct({
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        description,
        price,
        compare_at_price: comparePrice,
        sku,
        stock_quantity: stockQuantity,
        category_id: categoryId,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80'],
        shopee_item_id: shopeeItemId || `SHP-${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: stockQuantity === 0 ? 'out_of_stock' : 'active',
      });
    }

    setModalOpen(false);
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
            จัดการสินค้าและคลัง (Product Management)
          </h1>
          <p className="text-xs text-zinc-500">
            อัพโหลดรูปภาพทุกชนิดแปลงเป็น .webp อัตโนมัติ ปรับสต็อก และเชื่อมต่อ Shopee
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 hover:opacity-90 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มสินค้าใหม่ (แปลงเป็น WebP)</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า หรือ SKU..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                <th className="py-3.5 px-4">รูปภาพ (WebP)</th>
                <th className="py-3.5 px-4">ชื่อสินค้า & SKU</th>
                <th className="py-3.5 px-4">ราคาขาย</th>
                <th className="py-3.5 px-4">สต็อกคงเหลือ</th>
                <th className="py-3.5 px-4">สถานะ Shopee</th>
                <th className="py-3.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 relative">
                      <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[7px] font-mono font-bold px-1 rounded-tl">
                        WEBP
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-zinc-900 dark:text-white line-clamp-1">{prod.title}</p>
                    <p className="font-mono text-[10px] text-zinc-400">SKU: {prod.sku}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-black text-zinc-950 dark:text-white">฿{prod.price.toLocaleString()}</span>
                    {prod.compare_at_price && (
                      <span className="text-[10px] text-zinc-400 line-through block">
                        ฿{prod.compare_at_price.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {prod.stock_quantity <= 10 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                        {prod.stock_quantity} ชิ้น (ใกล้หมด)
                      </span>
                    ) : (
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">
                        {prod.stock_quantity} ชิ้น
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {prod.shopee_item_id ? (
                      <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-900">
                        {prod.shopee_item_id}
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-400">ยังไม่ซิงค์</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        title="แก้ไข"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        title="ลบสินค้า"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL (WITH WEBP UPLOADER) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  {editingProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  รองรับการอัพโหลดรูปภาพทุกนามสกุล และแปลงเป็น .webp ให้อัตโนมัติ
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              {/* Image to WebP Uploader Component */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>รูปภาพสินค้า (อัพโหลดไฟล์ใดก็ได้ จะแปลงเป็น .webp)</span>
                </label>
                <ImageToWebpUploader
                  existingImages={images}
                  onImagesConverted={handleWebpImagesConverted}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">ชื่อสินค้า</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น Aura Ceramic Table Lamp"
                  className="w-full mt-1 px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">ราคาขาย (฿)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3.5 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">ราคาเต็ม (ก่อนลด)</label>
                  <input
                    type="number"
                    value={comparePrice || ''}
                    onChange={(e) => setComparePrice(parseFloat(e.target.value) || undefined)}
                    placeholder="2490"
                    className="w-full mt-1 px-3.5 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">จำนวนในสต็อก</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 px-3.5 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">รหัส SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">รหัสสินค้าบน Shopee</label>
                  <input
                    type="text"
                    value={shopeeItemId}
                    onChange={(e) => setShopeeItemId(e.target.value)}
                    placeholder="SHP-99201948"
                    className="w-full mt-1 px-3.5 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">คำอธิบายสินค้า</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 text-xs font-bold rounded-xl text-zinc-700 dark:text-zinc-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  บันทึกสินค้า (Save Product)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

