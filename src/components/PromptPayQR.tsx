'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { generatePromptPayPayload } from '../lib/promptpay';
import { Copy, Check, QrCode as QrIcon } from 'lucide-react';

interface PromptPayQRProps {
  amount: number;
  promptPayId?: string; // 10 digit mobile or 13 digit tax ID
  accountName?: string;
}

export const PromptPayQR: React.FC<PromptPayQRProps> = ({
  amount,
  promptPayId = '0812345678', // Default store promptpay number
  accountName = 'MINIMAL STUDIO CO., LTD.',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Generate valid EMVCo PromptPay QR string
    const payload = generatePromptPayPayload(promptPayId, amount);

    QRCode.toCanvas(
      canvasRef.current,
      payload,
      {
        width: 220,
        margin: 2,
        color: {
          dark: '#00264d', // PromptPay Dark Blue
          light: '#ffffff',
        },
      },
      (error) => {
        if (error) console.error('PromptPay QR Error', error);
      }
    );
  }, [amount, promptPayId]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(promptPayId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs max-w-sm mx-auto">
      {/* Thai PromptPay Header Logo */}
      <div className="w-full bg-[#003d6b] text-white py-2 px-4 rounded-xl text-center mb-4 flex items-center justify-center gap-2">
        <QrIcon className="w-4 h-4" />
        <span className="font-bold text-xs tracking-wider uppercase">พร้อมเพย์ PromptPay</span>
      </div>

      {/* QR Code Canvas */}
      <div className="p-3 bg-white rounded-xl shadow-xs border border-zinc-100 flex items-center justify-center">
        <canvas ref={canvasRef} className="rounded" />
      </div>

      {/* Payment Details */}
      <div className="w-full mt-4 text-center space-y-1">
        <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">ชื่อบัญชี</p>
        <p className="text-xs font-semibold text-zinc-900 dark:text-white">{accountName}</p>
        
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
            {promptPayId}
          </span>
          <button
            onClick={handleCopyId}
            type="button"
            className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-white rounded"
            title="คัดลอกหมายเลขพร้อมเพย์"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-3">
          <p className="text-[11px] text-zinc-400">ยอดที่ต้องชำระ</p>
          <p className="text-2xl font-extrabold text-zinc-950 dark:text-white">
            ฿{amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <p className="text-[10px] text-zinc-400 pt-2">
          สแกนได้ผ่านทุกแอปธนาคารไทย (K PLUS, SCB EASY, Krungthai NEXT ฯลฯ)
        </p>
      </div>
    </div>
  );
};

