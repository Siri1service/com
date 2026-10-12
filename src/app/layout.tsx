import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SeoSchema } from "../components/SeoSchema";

export const metadata: Metadata = {
  title: "MINIMAL STUDIO | แพลตฟอร์มอีคอมเมิร์ซโมเดิร์นมินิมอล",
  description: "สินค้าไลฟ์สไตล์ เฟอร์นิเจอร์ และอุปกรณ์จัดโต๊ะทำงานสไตล์ Modern & Minimal รองรับการสั่งซื้อที่ง่ายดาย ตรวจสอบยอดโอน และออกใบกำกับภาษีเต็มรูป",
  keywords: [
    "minimalist ecommerce",
    "แต่งโต๊ะทำงาน",
    "โคมไฟมินิมอล",
    "โต๊ะทำงาน ergonomic",
    "ใบกำกับภาษีอิเล็กทรอนิกส์",
    "ตรวจสลิปโอนเงิน",
    "พร้อมเพย์ QR",
    "จัดส่ง Flash Express ไปรษณีย์ไทย",
    "Shopee sync"
  ],
  authors: [{ name: "Minimal Studio" }],
  creator: "Minimal Studio",
  publisher: "Minimal Studio",
  metadataBase: new URL("https://ecom-universal.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MINIMAL STUDIO | E-Commerce Modern & Minimal",
    description: "แพลตฟอร์มอีคอมเมิร์ซระดับพรีเมียม สั่งซื้อง่าย ตรวจสลิปอัตโนมัติ เชื่อมต่อ Shopee และ LINE",
    url: "https://ecom-universal.vercel.app",
    siteName: "MINIMAL STUDIO",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "MINIMAL STUDIO Lifestyle",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MINIMAL STUDIO | Modern & Minimal E-Commerce",
    description: "สั่งซื้อง่าย ตรวจสลิปอัตโนมัติ พร้อมใบปะหน้าพัสดุและใบกำกับภาษี",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=630&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readof<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <SeoSchema type="website" />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

