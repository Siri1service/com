-- ============================================================================
-- SUPABASE STORAGE CONFIGURATION
-- Buckets: products (WebP), slips (Payment slips), waybills (Shipping labels)
-- ============================================================================

-- Create storage buckets if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 5242880, ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif']),
  ('slips', 'slips', true, 5242880, ARRAY['image/webp', 'image/jpeg', 'image/png']),
  ('waybills', 'waybills', true, 5242880, ARRAY['image/webp', 'image/png', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Public access policies for product images
CREATE POLICY "Public Access Products" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Admin Upload Products" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products');

-- Policies for payment slips
CREATE POLICY "Users can upload slips" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'slips');

CREATE POLICY "View slips" ON storage.objects
  FOR SELECT USING (bucket_id = 'slips');

