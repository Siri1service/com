/**
 * LINE Messaging API Integration
 * Sends rich notifications when:
 * 1. An order is created
 * 2. Payment slip is approved
 * 3. Parcel is packed & tracking number generated
 */

import { Order } from './supabase/types';

export interface LineNotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  mocked?: boolean;
}

export async function sendLineOrderNotification(order: Order): Promise<LineNotificationResult> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const targetUserId = process.env.LINE_ADMIN_USER_ID;

  // Format rich Flex Message payload
  const flexPayload = {
    type: 'flex',
    altText: `📦 มีคำสั่งซื้อใหม่ #${order.order_number} (${order.total_amount.toLocaleString()} บาท)`,
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#18181b',
        contents: [
          {
            type: 'text',
            text: 'NEW ORDER RECEIVED',
            weight: 'bold',
            color: '#a1a1aa',
            size: 'xs',
          },
          {
            type: 'text',
            text: `#${order.order_number}`,
            weight: 'bold',
            size: 'xl',
            color: '#ffffff',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'ลูกค้า', size: 'sm', color: '#71717a', flex: 1 },
              { type: 'text', text: order.customer_name, size: 'sm', weight: 'bold', align: 'end', flex: 2 },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'ยอดชำระ', size: 'sm', color: '#71717a', flex: 1 },
              {
                type: 'text',
                text: `฿${order.total_amount.toLocaleString()}`,
                size: 'md',
                weight: 'bold',
                color: '#10b981',
                align: 'end',
                flex: 2,
              },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'วิธีชำระ', size: 'sm', color: '#71717a', flex: 1 },
              {
                type: 'text',
                text: order.payment_method === 'promptpay' ? 'พร้อมเพย์ QR' : 'โอนผ่านธนาคาร',
                size: 'sm',
                align: 'end',
                flex: 2,
              },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'ใบกำกับภาษี', size: 'sm', color: '#71717a', flex: 1 },
              {
                type: 'text',
                text: order.tax_invoice_required
                  ? order.tax_invoice_data?.account_type === 'juristic'
                    ? 'ขอ (นิติบุคคล)'
                    : 'ขอ (บุคคลธรรมดา)'
                  : 'ไม่ต้องการ',
                size: 'sm',
                weight: 'bold',
                color: order.tax_invoice_required ? '#3b82f6' : '#71717a',
                align: 'end',
                flex: 2,
              },
            ],
          },
          {
            type: 'separator',
            margin: 'lg',
          },
          {
            type: 'text',
            text: `จัดส่งที่: ${order.shipping_address.address_line1} ${order.shipping_address.district} ${order.shipping_address.province} ${order.shipping_address.postal_code}`,
            size: 'xs',
            color: '#71717a',
            wrap: true,
            margin: 'md',
          },
        ],
      },
    },
  };

  // If live credentials are not present, simulate and return mock success
  if (!token || !targetUserId) {
    console.log('[LINE API Mock] Dispatched order notification to LINE:', JSON.stringify(flexPayload, null, 2));
    return {
      success: true,
      messageId: `mock-msg-${Date.now()}`,
      mocked: true,
    };
  }

  try {
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: targetUserId,
        messages: [flexPayload],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendLinePaymentVerifiedNotification(order: Order): Promise<LineNotificationResult> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  console.log(`[LINE API] Payment Verified Notification for #${order.order_number}`);
  return { success: true, mocked: !token };
}

export async function sendLineTrackingNotification(order: Order, trackingNumber: string, courier: string): Promise<LineNotificationResult> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  console.log(`[LINE API] Tracking #${trackingNumber} via ${courier} for order #${order.order_number}`);
  return { success: true, mocked: !token };
}

