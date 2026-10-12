'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { convertImageToWebp, formatBytes, WebpConversionResult } from '../lib/webp-converter';

interface ImageToWebpUploaderProps {
  onImagesConverted: (results: WebpConversionResult[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

export const ImageToWebpUploader: React.FC<ImageToWebpUploaderProps> = ({
  onImagesConverted,
  existingImages = [],
  maxImages = 5,
}) => {
  const [converting, setConverting] = useState(false);
  const [conversions, setConversions] = useState<WebpConversionResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    setConverting(true);
    const results: WebpConversionResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        // Automatically converts any image to modern .webp format!
        const result = await convertImageToWebp(file, 0.85);
        results.push(result);
      } catch (err) {
        console.error('Failed to convert image to webp', err);
      }
    }

    const updated = [...conversions, ...results].slice(0, maxImages);
    setConversions(updated);
    onImagesConverted(updated);
    setConverting(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeConversion = (index: number) => {
    const updated = conversions.filter((_, i) => i !== index);
    setConversions(updated);
    onImagesConverted(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-zinc-950 bg-zinc-100 dark:border-white dark:bg-zinc-800'
            : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200">
            {converting ? (
              <div className="w-5 h-5 border-2 border-zinc-950 dark:border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 stroke-[1.5]" />
            )}
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-zinc-900 dark:text-white">
              คลิกหรือลากรูปภาพมาวางที่นี่ (รองรับ PNG, JPG, JPEG, GIF, BMP, HEIC)
            </p>
            <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 inline" />
              ระบบจะแปลงไฟล์เป็น <span className="font-mono font-bold text-zinc-950 dark:text-white">.webp</span> อัตโนมัติเพื่อความเร็วสูงสุด
            </p>
          </div>
        </div>
      </div>

      {/* WebP Conversions Result List */}
      {conversions.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-zinc-900 dark:text-white">
            ภาพที่แปลงเป็น WebP สำเร็จ ({conversions.length}/{maxImages}):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conversions.map((conv, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200 dark:border-zinc-800">
                  <img src={conv.previewUrl} alt={conv.newName} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded-tl">
                    WEBP
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">
                    {conv.newName}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-0.5">
                    <span className="line-through">{formatBytes(conv.originalSize)}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-zinc-400" />
                    <span className="font-bold text-emerald-600">{formatBytes(conv.webpSize)}</span>
                  </div>
                  <span className="inline-block mt-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                    ประหยัดพื้นที่ {conv.savingsPercent}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeConversion(idx)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  title="ลบภาพ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing WebP Images */}
      {existingImages.length > 0 && conversions.length === 0 && (
        <div className="space-y-2">
          <p className="text-[11px] text-zinc-400">รูปภาพปัจจุบันของสินค้า:</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {existingImages.map((img, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                <img src={img} alt={`Existing ${i}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-zinc-800 text-white text-[8px] px-1">WEBP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

