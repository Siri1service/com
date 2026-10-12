import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Modal,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Sample Thai Products for React Native Mobile App
const PRODUCTS = [
  {
    id: 'prod-01',
    title: 'Aura Ceramic Table Lamp (Warm Minimal)',
    sku: 'LMP-AURA-01',
    price: 1890,
    compare_price: 2490,
    stock: 42,
    category: 'Minimal Living',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    description: 'โคมไฟตั้งโต๊ะเซรามิกทำมือ ผิวสัมผัสแมตต์ แสงวอร์มไวท์นุ่มนวล ปรับความสว่างได้ 3 ระดับ',
  },
  {
    id: 'prod-02',
    title: 'Ergonomic Solid Walnut Desk Shelf',
    sku: 'DSK-WLN-02',
    price: 3450,
    compare_price: 3990,
    stock: 18,
    category: 'Desk & Workspace',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
    description: 'ชั้นวางจอคอมพิวเตอร์ไม้แท้วอลนัทอเมริกัน โครงสร้างอลูมิเนียมเกรดพรีเมียม ช่วยลดอาการปวดคอ',
  },
  {
    id: 'prod-03',
    title: 'Heavyweight Raw Cotton Oversized Tee',
    sku: 'TSH-RAW-03',
    price: 790,
    compare_price: 990,
    stock: 120,
    category: 'Essential Apparel',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
    description: 'เสื้อยืดคอตตอนออร์แกนิก 280 GSM ทรง Boxy Oversized ทรงสวยไม่ย้วย สวมใส่สบายระบายอากาศดี',
  },
  {
    id: 'prod-04',
    title: 'Precision Matte Black Pour-Over Kettle',
    sku: 'COF-KTL-04',
    price: 1290,
    compare_price: 1590,
    stock: 35,
    category: 'Artisanal Coffee',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80',
    description: 'กาดริปกาแฟคอห่าน สแตนเลสสตีล 304 เคลือบผิวดำแมตต์ ด้ามจับไม้กันความร้อน สำหรับคอกาแฟ Specialty',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'shop' | 'cart' | 'orders' | 'profile'>('shop');
  const [cart, setCart] = useState<{ product: typeof PRODUCTS[0]; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // User & Tax Profile State
  const [accountType, setAccountType] = useState<'individual' | 'juristic'>('individual');
  const [fullName, setFullName] = useState('สมชาย วงศ์สวัสดิ์');
  const [phone, setPhone] = useState('0812345678');
  const [taxId, setTaxId] = useState('1100200300401');
  const [companyName, setCompanyName] = useState('บริษัท มินิมอล โซลูชั่นส์ จำกัด');
  const [branchId, setBranchId] = useState('00000');
  const [address, setAddress] = useState('123/45 ซอยสุขุมวิท 71 วัฒนา กรุงเทพฯ 10110');

  // Orders State
  const [orders, setOrders] = useState([
    {
      id: 'ORD-20261012-0001',
      total: 1940,
      status: 'รอตรวจสอบยอดโอน',
      statusStep: 2,
      tracking: 'TH0129384819F (Flash Express)',
      date: '12 ต.ค. 2026, 12:30 น.',
    },
  ]);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    Alert.alert('เพิ่มลงตะกร้าแล้ว', `${product.title} อยู่ในตะกร้าสินค้าของคุณแล้ว`);
  };

  const cartTotal = cart.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  const shippingFee = cartTotal > 1500 || cartTotal === 0 ? 0 : 50;

  const handleCompleteCheckout = () => {
    if (cart.length === 0) return;
    const newOrd = {
      id: `ORD-20261012-${Math.floor(1000 + Math.random() * 9000)}`,
      total: cartTotal + shippingFee,
      status: 'รอตรวจสอบยอดโอน (แนบสลิปแล้ว)',
      statusStep: 2,
      tracking: 'กำลังเตรียมจัดส่ง (Flash Express)',
      date: 'เมื่อสักครู่',
    };
    setOrders([newOrd, ...orders]);
    setCart([]);
    setCheckoutModalOpen(false);
    setActiveTab('orders');
    Alert.alert('สั่งซื้อสำเร็จ', `บันทึกคำสั่งซื้อ #${newOrd.id} และส่งแจ้งเตือนทาง LINE เรียบร้อยแล้ว`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Modern Minimal Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>E</Text>
          </View>
          <Text style={styles.brandTitle}>
            MINIMAL<Text style={styles.brandSubtitle}>STUDIO</Text>
          </Text>
        </View>
        <Text style={styles.platformBadge}>React Native Universal</Text>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* TAB 1: SHOP STOREFRONT */}
        {activeTab === 'shop' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.heroBanner}>
              <Text style={styles.heroTag}>COLLECTION 2026</Text>
              <Text style={styles.heroTitle}>ความเรียบง่ายเหนือกาลเวลา</Text>
              <Text style={styles.heroDesc}>
                รองรับการสั่งซื้อผ่านแอปพลิเคชัน โอนเงินพร้อมเพย์ และออกใบกำกับภาษีเต็มรูป
              </Text>
            </View>

            <Text style={styles.sectionTitle}>สินค้าแนะนำ (Featured Products)</Text>

            <View style={styles.productGrid}>
              {PRODUCTS.map((prod) => (
                <TouchableOpacity
                  key={prod.id}
                  style={styles.productCard}
                  activeOpacity={0.8}
                  onPress={() => setSelectedProduct(prod)}
                >
                  <Image source={{ uri: prod.image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productSku}>{prod.sku}</Text>
                    <Text style={styles.productCardTitle} numberOfLines={2}>
                      {prod.title}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.productPrice}>฿{prod.price.toLocaleString()}</Text>
                      <Text style={styles.stockText}>คลัง: {prod.stock}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* TAB 2: CART */}
        {activeTab === 'cart' && (
          <View style={styles.tabContainer}>
            {cart.length > 0 ? (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>ตะกร้าสินค้า ({cart.length} รายการ)</Text>
                {cart.map((it) => (
                  <View key={it.product.id} style={styles.cartItem}>
                    <Image source={{ uri: it.product.image }} style={styles.cartThumb} />
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemTitle} numberOfLines={1}>
                        {it.product.title}
                      </Text>
                      <Text style={styles.cartItemPrice}>
                        ฿{it.product.price.toLocaleString()} x {it.quantity}
                      </Text>
                    </View>
                    <Text style={styles.cartItemSubtotal}>
                      ฿{(it.product.price * it.quantity).toLocaleString()}
                    </Text>
                  </View>
                ))}

                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>ยอดรวมสินค้า:</Text>
                    <Text style={styles.summaryValue}>฿{cartTotal.toLocaleString()}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>ค่าจัดส่ง (Flash/EMS):</Text>
                    <Text style={styles.summaryValue}>
                      {shippingFee === 0 ? 'ส่งฟรี' : `฿${shippingFee}`}
                    </Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                    <Text style={styles.totalLabel}>ยอดชำระทั้งสิ้น:</Text>
                    <Text style={styles.totalValue}>
                      ฿{(cartTotal + shippingFee).toLocaleString()}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => setCheckoutModalOpen(true)}
                  >
                    <Text style={styles.checkoutBtnText}>ดำเนินการชำระเงิน (Checkout)</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <View style={styles.emptyView}>
                <Text style={styles.emptyText}>ไม่มีสินค้าในตะกร้าของคุณ</Text>
              </View>
            )}
          </View>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>ประวัติคำสั่งซื้อและสถานะพัสดุ</Text>
            {orders.map((ord) => (
              <View key={ord.id} style={styles.orderCard}>
                <View style={styles.orderHeaderRow}>
                  <Text style={styles.orderIdText}>{ord.id}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{ord.status}</Text>
                  </View>
                </View>
                <Text style={styles.orderDate}>{ord.date}</Text>
                <Text style={styles.orderTotal}>ยอดชำระ: ฿{ord.total.toLocaleString()}</Text>
                <View style={styles.trackingBox}>
                  <Text style={styles.trackingText}>🚚 เลขพัสดุ: {ord.tracking}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* TAB 4: PROFILE & TAX INVOICE */}
        {activeTab === 'profile' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>ตั้งค่าข้อมูลภาษีและการจัดส่ง</Text>

            {/* Type selector */}
            <View style={styles.accountTypeRow}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  accountType === 'individual' && styles.typeButtonActive,
                ]}
                onPress={() => setAccountType('individual')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    accountType === 'individual' && styles.typeButtonTextActive,
                  ]}
                >
                  บุคคลธรรมดา
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  accountType === 'juristic' && styles.typeButtonActive,
                ]}
                onPress={() => setAccountType('juristic')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    accountType === 'juristic' && styles.typeButtonTextActive,
                  ]}
                >
                  นิติบุคคล (บริษัท)
                </Text>
              </TouchableOpacity>
            </View>

            {accountType === 'juristic' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ชื่อบริษัท / นิติบุคคล</Text>
                <TextInput
                  style={styles.input}
                  value={companyName}
                  onChangeText={setCompanyName}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {accountType === 'juristic' ? 'ชื่อผู้ติดต่อ' : 'ชื่อ-นามสกุล'}
              </Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
              <TextInput
                style={styles.input}
                value={phone}
                keyboardType="phone-pad"
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                เลขประจำตัวผู้เสียภาษี 13 หลัก ({accountType === 'juristic' ? 'นิติบุคคล' : 'บัตรประชาชน'})
              </Text>
              <TextInput
                style={styles.input}
                value={taxId}
                keyboardType="numeric"
                maxLength={13}
                onChangeText={setTaxId}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ที่อยู่จัดส่งพัสดุเริ่มต้น</Text>
              <TextInput
                style={[styles.input, { height: 70 }]}
                multiline
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <TouchableOpacity
              style={styles.saveProfileBtn}
              onPress={() => Alert.alert('บันทึกสำเร็จ', 'อัปเดตข้อมูลผู้ใช้งานและภาษีเรียบร้อย')}
            >
              <Text style={styles.saveProfileBtnText}>บันทึกข้อมูลโปรไฟล์</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Bottom Tab Bar Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('shop')}
        >
          <Text style={[styles.tabLabel, activeTab === 'shop' && styles.tabLabelActive]}>
            🛍️ สินค้า
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('cart')}
        >
          <Text style={[styles.tabLabel, activeTab === 'cart' && styles.tabLabelActive]}>
            🛒 ตะกร้า ({cart.reduce((s, i) => s + i.quantity, 0)})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabLabel, activeTab === 'orders' && styles.tabLabelActive]}>
            📦 คำสั่งซื้อ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
            👤 ข้อมูลภาษี
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal visible={Boolean(selectedProduct)} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedProduct(null)}
              >
                <Text style={styles.closeBtnText}>✕ ปิด</Text>
              </TouchableOpacity>

              <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />

              <Text style={styles.modalSku}>{selectedProduct.sku}</Text>
              <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
              <Text style={styles.modalPrice}>
                ฿{selectedProduct.price.toLocaleString()}
              </Text>

              <Text style={styles.modalDesc}>{selectedProduct.description}</Text>

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.addCartBtn}
                  onPress={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  <Text style={styles.addCartBtnText}>เพิ่มลงตะกร้า</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buyNowBtn}
                  onPress={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                    setCheckoutModalOpen(true);
                  }}
                >
                  <Text style={styles.buyNowBtnText}>สั่งซื้อทันที</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* Checkout & Slip Modal */}
      {checkoutModalOpen && (
        <Modal visible={checkoutModalOpen} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setCheckoutModalOpen(false)}
              >
                <Text style={styles.closeBtnText}>✕ ยกเลิก</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>ยืนยันการชำระเงิน (PromptPay)</Text>

              <View style={styles.promptPayBox}>
                <Text style={styles.promptPayTitle}>พร้อมเพย์ PromptPay</Text>
                <Text style={styles.promptPayNumber}>081-234-5678</Text>
                <Text style={styles.promptPayAmount}>
                  ยอดชำระ: ฿{(cartTotal + shippingFee).toLocaleString()}
                </Text>
              </View>

              <View style={styles.slipUploadBox}>
                <Text style={styles.slipUploadText}>📷 แนบภาพสลิปโอนเงิน (จำลอง)</Text>
                <Text style={styles.slipDesc}>
                  ระบบจะแปลงเป็น .webp และบันทึกลงฐานข้อมูล Supabase อัตโนมัติ
                </Text>
              </View>

              <TouchableOpacity
                style={styles.confirmOrderBtn}
                onPress={handleCompleteCheckout}
              >
                <Text style={styles.confirmOrderBtnText}>
                  ยืนยันการสั่งซื้อและแจ้งเตือนผ่าน LINE
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f4f4f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#09090b',
  },
  brandSubtitle: {
    color: '#a1a1aa',
    fontWeight: '300',
  },
  platformBadge: {
    fontSize: 10,
    color: '#71717a',
    backgroundColor: '#f4f4f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroBanner: {
    backgroundColor: '#fafafa',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    marginBottom: 20,
  },
  heroTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#71717a',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#09090b',
    marginTop: 4,
  },
  heroDesc: {
    fontSize: 12,
    color: '#52525b',
    marginTop: 6,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#09090b',
    marginBottom: 12,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 44) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f4f4f5',
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f4f4f5',
  },
  productInfo: {
    padding: 12,
  },
  productSku: {
    fontSize: 9,
    color: '#a1a1aa',
    fontFamily: 'monospace',
  },
  productCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#09090b',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#09090b',
  },
  stockText: {
    fontSize: 10,
    color: '#10b981',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#f4f4f5',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    color: '#71717a',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#09090b',
    fontWeight: '800',
  },
  tabContainer: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#f4f4f5',
    borderRadius: 14,
    marginBottom: 8,
  },
  cartThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cartItemTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  cartItemPrice: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 2,
  },
  cartItemSubtotal: {
    fontSize: 13,
    fontWeight: '800',
  },
  summaryCard: {
    backgroundColor: '#fafafa',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#71717a',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderColor: '#e4e4e7',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  checkoutBtn: {
    backgroundColor: '#09090b',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  orderCard: {
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    marginBottom: 12,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: '#92400e',
    fontSize: 10,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 4,
  },
  orderTotal: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  trackingBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  trackingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  accountTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#09090b',
    borderColor: '#09090b',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717a',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    color: '#71717a',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    backgroundColor: '#fafafa',
  },
  saveProfileBtn: {
    backgroundColor: '#09090b',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveProfileBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalContent: {
    padding: 20,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    marginVertical: 12,
  },
  modalSku: {
    fontSize: 10,
    color: '#a1a1aa',
    fontFamily: 'monospace',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#09090b',
    marginTop: 4,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#09090b',
    marginTop: 6,
  },
  modalDesc: {
    fontSize: 12,
    color: '#52525b',
    lineHeight: 18,
    marginTop: 8,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  addCartBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#09090b',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addCartBtnText: {
    fontWeight: '700',
    fontSize: 12,
  },
  buyNowBtn: {
    flex: 1,
    backgroundColor: '#09090b',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyNowBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  promptPayBox: {
    backgroundColor: '#00264d',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  promptPayTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  promptPayNumber: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginTop: 6,
  },
  promptPayAmount: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
  },
  slipUploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e4e4e7',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  slipUploadText: {
    fontSize: 13,
    fontWeight: '700',
  },
  slipDesc: {
    fontSize: 11,
    color: '#a1a1aa',
    marginTop: 4,
    textAlign: 'center',
  },
  confirmOrderBtn: {
    backgroundColor: '#09090b',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmOrderBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
});

