-- ============================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR MODERN MINIMAL E-COMMERCE
-- Supports: Web, iOS, Android, Onboarding (บุคคล/นิติบุคคล, ภาษี), WebP, Shopee, LINE
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  account_type TEXT DEFAULT 'individual' CHECK (account_type IN ('individual', 'juristic')),
  tax_id TEXT, -- 13 digits Tax ID for Thailand
  company_name TEXT, -- Required if juristic
  branch_id TEXT DEFAULT '00000', -- '00000' = Head Office
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  subdistrict TEXT NOT NULL, -- แขวง / ตำบล
  district TEXT NOT NULL,    -- เขต / อำเภอ
  province TEXT NOT NULL,    -- จังหวัด
  postal_code TEXT NOT NULL, -- รหัสไปรษณีย์
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0
);

-- 4. PRODUCTS (All images stored in .webp)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL,
  compare_at_price NUMERIC(12, 2),
  cost_price NUMERIC(12, 2),
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  stock_quantity INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'out_of_stock', 'archived')),
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[], -- WebP image URLs
  shopee_item_id TEXT,
  shopee_synced_at TIMESTAMPTZ,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS & CHECKOUT
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- e.g. ORD-20261012-8821
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending_payment' CHECK (
    status IN (
      'pending_payment',
      'payment_verifying',
      'confirmed',
      'processing',
      'packed',
      'shipped',
      'delivered',
      'cancelled'
    )
  ),
  subtotal NUMERIC(12, 2) NOT NULL,
  shipping_fee NUMERIC(12, 2) DEFAULT 0,
  discount NUMERIC(12, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL,
  payment_method TEXT DEFAULT 'promptpay' CHECK (
    payment_method IN ('promptpay', 'bank_transfer', 'credit_card', 'cod')
  ),
  payment_status TEXT DEFAULT 'unpaid' CHECK (
    payment_status IN ('unpaid', 'verifying', 'paid', 'refunded', 'failed')
  ),
  slip_url TEXT, -- Bank transfer slip image URL (.webp)
  slip_transferred_amount NUMERIC(12, 2),
  slip_transferred_at TIMESTAMPTZ,
  slip_verified_at TIMESTAMPTZ,
  slip_verified_by UUID REFERENCES public.profiles(id),
  courier_code TEXT CHECK (
    courier_code IN ('thai_post', 'flash_express', 'kerry_express', 'j_and_t')
  ),
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  tax_invoice_required BOOLEAN DEFAULT FALSE,
  tax_invoice_data JSONB, -- { account_type, company_name, tax_id, branch_id, address }
  shipping_address JSONB NOT NULL, -- { recipient_name, phone, address_line1, subdistrict, district, province, postal_code }
  customer_notes TEXT,
  internal_notes TEXT,
  line_notified BOOLEAN DEFAULT FALSE,
  shopee_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  image_url TEXT,
  subtotal NUMERIC(12, 2) NOT NULL
);

-- 7. ORDER TIMELINES (Real-time Step Pipeline)
CREATE TABLE IF NOT EXISTS public.order_timelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COURIER SHIPMENTS (Logistics Integration)
CREATE TABLE IF NOT EXISTS public.courier_shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  courier TEXT NOT NULL,
  tracking_number TEXT NOT NULL,
  status TEXT DEFAULT 'booked',
  label_url TEXT,
  api_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SHOPEE SYNC LOGS
CREATE TABLE IF NOT EXISTS public.shopee_sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- 'product_sync', 'inventory_sync', 'order_import'
  item_count INT DEFAULT 0,
  status TEXT DEFAULT 'success', -- 'success', 'warning', 'failed'
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MARKETING CAMPAIGNS (Gmail / Marketing hub)
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  audience_filter TEXT DEFAULT 'all', -- 'all', 'juristic', 'repeat_customers', 'inactive'
  recipient_count INT DEFAULT 0,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopee_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & update their own profile; Admins have full access
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Products: Everyone can read active products; Admins can do all
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (status = 'active' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins have full access to products" ON public.products
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Orders: Users can read own orders; Admins can read & manage all orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins have full access to orders" ON public.orders
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Order Items: Viewable if order is viewable
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'))
  );

-- ============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP (Google, Facebook, Email)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'customer',
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

