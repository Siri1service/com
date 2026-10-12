export type AccountType = 'individual' | 'juristic';

export type UserRole = 'customer' | 'admin' | 'staff';

export type OrderStatus =
  | 'pending_payment'
  | 'payment_verifying'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'promptpay' | 'bank_transfer' | 'credit_card' | 'cod';

export type PaymentStatus = 'unpaid' | 'verifying' | 'paid' | 'refunded' | 'failed';

export type CourierCode = 'thai_post' | 'flash_express' | 'kerry_express' | 'j_and_t';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  account_type: AccountType; // บุคคลธรรมดา หรือ นิติบุคคล
  tax_id?: string; // เลขประจำตัวผู้เสียภาษี 13 หลัก
  company_name?: string; // ชื่อบริษัท/นิติบุคคล
  branch_id?: string; // 00000 = สำนักงานใหญ่
  role: UserRole;
  onboarding_completed: boolean;
  status: 'active' | 'suspended';
  created_at: string;
}

export interface TaxInvoiceInfo {
  account_type: AccountType;
  name_or_company: string;
  tax_id: string; // 13 digits
  branch_id: string; // '00000' หรือ เลขสาขา
  address: string;
  phone: string;
}

export interface ShippingAddress {
  recipient_name: string;
  phone: string;
  address_line1: string;
  subdistrict: string;
  district: string;
  province: string;
  postal_code: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  sku: string;
  barcode?: string;
  stock_quantity: number;
  status: 'draft' | 'active' | 'out_of_stock' | 'archived';
  category_id: string;
  images: string[]; // WebP format URLs
  shopee_item_id?: string;
  shopee_synced_at?: string;
  views_count?: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image_url: string;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  slip_url?: string;
  slip_transferred_amount?: number;
  slip_transferred_at?: string;
  slip_verified_at?: string;
  slip_verified_by?: string;
  courier_code?: CourierCode;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  tax_invoice_required: boolean;
  tax_invoice_data?: TaxInvoiceInfo;
  shipping_address: ShippingAddress;
  customer_notes?: string;
  internal_notes?: string;
  line_notified: boolean;
  shopee_order_id?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface OrderTimeline {
  id: string;
  order_id: string;
  status: OrderStatus;
  title: string;
  description: string;
  created_at: string;
}

export interface CourierShipment {
  id: string;
  order_id: string;
  courier: CourierCode;
  tracking_number: string;
  status: string;
  label_url?: string;
  created_at: string;
}

