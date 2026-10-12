/**
 * Logistics & Courier Integration Adapter
 * Supports Thai Couriers: Flash Express, Thailand Post, Kerry Express, J&T Express
 */

import { CourierCode, Order } from './supabase/types';

export interface CourierInfo {
  code: CourierCode;
  nameTh: string;
  nameEn: string;
  trackingPrefix: string;
  trackingUrlPattern: string;
  color: string;
  hotline: string;
}

export const COURIER_PROVIDERS: Record<CourierCode, CourierInfo> = {
  flash_express: {
    code: 'flash_express',
    nameTh: 'แฟลช เอ็กซ์เพรส (Flash Express)',
    nameEn: 'Flash Express',
    trackingPrefix: 'TH',
    trackingUrlPattern: 'https://www.flashexpress.co.th/tracking/?se={TRACKING}',
    color: '#eab308', // Yellow
    hotline: '1436',
  },
  thai_post: {
    code: 'thai_post',
    nameTh: 'ไปรษณีย์ไทย (EMS Thailand Post)',
    nameEn: 'Thailand Post',
    trackingPrefix: 'ED',
    trackingUrlPattern: 'https://track.thailandpost.co.th/?trackNumber={TRACKING}',
    color: '#ef4444', // Red
    hotline: '1545',
  },
  kerry_express: {
    code: 'kerry_express',
    nameTh: 'เคอรี่ เอ็กซ์เพรส (Kerry Express)',
    nameEn: 'Kerry Express',
    trackingPrefix: 'KEX',
    trackingUrlPattern: 'https://th.kerryexpress.com/th/track/?track={TRACKING}',
    color: '#f97316', // Orange
    hotline: '1217',
  },
  j_and_t: {
    code: 'j_and_t',
    nameTh: 'เจแอนด์ที เอ็กซ์เพรส (J&T Express)',
    nameEn: 'J&T Express',
    trackingPrefix: 'JT',
    trackingUrlPattern: 'https://www.jtexpress.co.th/trajectoryQuery?bills={TRACKING}',
    color: '#dc2626', // Deep Red
    hotline: '1470',
  },
};

export interface ShipmentResult {
  success: boolean;
  courier: CourierCode;
  trackingNumber: string;
  trackingUrl: string;
  barcode: string;
  labelUrl?: string;
  estimatedDeliveryDate: string;
  createdAt: string;
}

export function generateTrackingNumber(courier: CourierCode): string {
  const randomNum = Math.floor(100000000 + Math.random() * 900000000);
  switch (courier) {
    case 'flash_express':
      return `TH${randomNum}F`;
    case 'thai_post':
      return `ED${randomNum}TH`;
    case 'kerry_express':
      return `KEX${randomNum}`;
    case 'j_and_t':
      return `JT${randomNum}`;
    default:
      return `TRK${randomNum}`;
  }
}

export async function createCourierShipment(order: Order, courier: CourierCode): Promise<ShipmentResult> {
  const trackingNumber = generateTrackingNumber(courier);
  const info = COURIER_PROVIDERS[courier];
  const trackingUrl = info.trackingUrlPattern.replace('{TRACKING}', trackingNumber);

  // Estimated delivery: 1-2 days in Thailand
  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 2);

  return {
    success: true,
    courier,
    trackingNumber,
    trackingUrl,
    barcode: trackingNumber,
    estimatedDeliveryDate: estDate.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    createdAt: new Date().toISOString(),
  };
}

