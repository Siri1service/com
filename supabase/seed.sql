-- ============================================================================
-- SUPABASE SEED DATA (Minimal & Modern E-Commerce Thailand)
-- ============================================================================

-- Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order)
VALUES
  ('cat_living', 'Minimal Living', 'minimal-living', 'อุปกรณ์ตกแต่งบ้านและเฟอร์นิเจอร์สไตล์มินิมอล', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', 1),
  ('cat_workspace', 'Desk & Workspace', 'desk-workspace', 'อุปกรณ์จัดโต๊ะทำงาน เพิ่มสมาธิและประสิทธิภาพ', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', 2),
  ('cat_apparel', 'Essential Apparel', 'essential-apparel', 'เสื้อผ้าเนื้อผ้าพรีเมียม ดีไซน์เรียบหรูเหนือกาลเวลา', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80', 3),
  ('cat_coffee', 'Artisanal Coffee', 'artisanal-coffee', 'อุปกรณ์ดริปกาแฟและเมล็ดกาแฟคั่วพิเศษ Specialty', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80', 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Sample Products
INSERT INTO public.products (id, title, slug, description, price, compare_at_price, cost_price, sku, barcode, stock_quantity, status, category_id, images, shopee_item_id)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'Aura Ceramic Table Lamp (Warm Minimal)',
    'aura-ceramic-table-lamp',
    'โคมไฟตั้งโต๊ะเซรามิกทำมือ ผิวสัมผัสแมตต์ แสงวอร์มไวท์นุ่มนวล ปรับความสว่างได้ 3 ระดับ เหมาะสำหรับโต๊ะทำงานและข้างเตียง',
    1890.00,
    2490.00,
    950.00,
    'LMP-AURA-01',
    '8859123400012',
    42,
    'active',
    'cat_living',
    ARRAY[
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80'
    ],
    'SHP-99201948'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Ergonomic Solid Walnut Desk Shelf',
    'ergonomic-solid-walnut-desk-shelf',
    'ชั้นวางจอคอมพิวเตอร์ไม้แท้วอลนัทอเมริกัน โครงสร้างอลูมิเนียมเกรดพรีเมียม ช่วยปรับระดับสายตาลดอาการปวดคอ พร้อมช่องซ่อนสายไฟ',
    3450.00,
    3990.00,
    1800.00,
    'DSK-WLN-02',
    '8859123400029',
    18,
    'active',
    'cat_workspace',
    ARRAY[
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=80'
    ],
    'SHP-99201949'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Heavyweight Raw Cotton Oversized Tee',
    'heavyweight-raw-cotton-oversized-tee',
    'เสื้อยืดคอตตอนออร์แกนิก 280 GSM ทรง Boxy Oversized ทรงสวยไม่ย้วย สวมใส่สบายระบายอากาศดี เหมาะกับสภาพอากาศเมืองไทย',
    790.00,
    990.00,
    320.00,
    'TSH-RAW-03',
    '8859123400036',
    120,
    'active',
    'cat_apparel',
    ARRAY[
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80'
    ],
    'SHP-99201950'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Precision Matte Black Pour-Over Kettle 600ml',
    'precision-matte-black-pour-over-kettle',
    'กาดริปกาแฟคอห่าน ควบคุมสายน้ำได้อย่างแม่นยำ สแตนเลสสตีล 304 เคลือบผิวดำแมตต์ ด้ามจับไม้กันความร้อน สำหรับคอกาแฟ Specialty',
    1290.00,
    1590.00,
    580.00,
    'COF-KTL-04',
    '8859123400043',
    35,
    'active',
    'cat_coffee',
    ARRAY[
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80'
    ],
    'SHP-99201951'
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'Wireless Mechanical Keyboard 75% (Gateron Yellow)',
    'wireless-mechanical-keyboard-75',
    'คีย์บอร์ดกลไกไร้สาย บอดี้อลูมิเนียม CNC สวิตช์ลูปสำเร็จเสียงเงียบนุ่ม ทรงกะทัดรัด แบตเตอรี่ใช้งานได้นาน 200 ชั่วโมง',
    4290.00,
    4990.00,
    2200.00,
    'KBD-MECH-05',
    '8859123400050',
    9, -- Low stock alert demonstration
    'active',
    'cat_workspace',
    ARRAY[
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&q=80'
    ],
    'SHP-99201952'
  )
ON CONFLICT (id) DO NOTHING;

-- Sample Orders to demonstrate Admin Slip Verification & Stepper Tracker
INSERT INTO public.orders (
  id,
  order_number,
  customer_name,
  customer_email,
  customer_phone,
  status,
  subtotal,
  shipping_fee,
  discount,
  total_amount,
  payment_method,
  payment_status,
  slip_url,
  slip_transferred_amount,
  slip_transferred_at,
  courier_code,
  tracking_number,
  tax_invoice_required,
  tax_invoice_data,
  shipping_address,
  created_at
)
VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    'ORD-20261012-0001',
    'สมชาย วงศ์สวัสดิ์',
    'somchai.w@example.com',
    '0812345678',
    'payment_verifying',
    1890.00,
    50.00,
    0.00,
    1940.00,
    'promptpay',
    'verifying',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80',
    1940.00,
    NOW() - INTERVAL '15 minutes',
    'flash_express',
    NULL,
    TRUE,
    '{"account_type": "individual", "tax_id": "1100200300401", "name": "สมชาย วงศ์สวัสดิ์", "branch": "สำนักงานใหญ่", "address": "123 ถ.สุขุมวิท พระโขนง กรุงเทพฯ 10110"}'::JSONB,
    '{"recipient_name": "สมชาย วงศ์สวัสดิ์", "phone": "0812345678", "address_line1": "123/45 คอนโดมิเนียมสุขุมวิท ชั้น 18", "subdistrict": "พระโขนงเหนือ", "district": "วัฒนา", "province": "กรุงเทพมหานคร", "postal_code": "10110"}'::JSONB,
    NOW() - INTERVAL '30 minutes'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'ORD-20261012-0002',
    'บริษัท มินิมอล โซลูชั่นส์ จำกัด',
    'finance@minimalsolutions.co.th',
    '028889999',
    'shipped',
    7740.00,
    0.00,
    200.00,
    7540.00,
    'bank_transfer',
    'paid',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    7540.00,
    NOW() - INTERVAL '1 day',
    'flash_express',
    'TH0129384819F',
    TRUE,
    '{"account_type": "juristic", "tax_id": "0105562098123", "company_name": "บริษัท มินิมอล โซลูชั่นส์ จำกัด", "branch": "00000", "address": "88/1 อาคารสาทรทาวเวอร์ ชั้น 12 สาทร ยานนาวา กรุงเทพฯ 10120"}'::JSONB,
    '{"recipient_name": "แผนกจัดซื้อ (คุณกานดา)", "phone": "028889999", "address_line1": "88/1 อาคารสาทรทาวเวอร์ ชั้น 12", "subdistrict": "ยานนาวา", "district": "สาทร", "province": "กรุงเทพมหานคร", "postal_code": "10120"}'::JSONB,
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- Order Items
INSERT INTO public.order_items (id, order_id, product_id, title, price, quantity, image_url, subtotal)
VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Aura Ceramic Table Lamp (Warm Minimal)',
    1890.00,
    1,
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80',
    1890.00
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    'Ergonomic Solid Walnut Desk Shelf',
    3450.00,
    2,
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&q=80',
    6900.00
  )
ON CONFLICT (id) DO NOTHING;

