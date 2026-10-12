'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, UserProfile, OrderStatus, CourierCode, TaxInvoiceInfo, ShippingAddress, PaymentMethod } from '../supabase/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from '../mock-data';
import { sendLineOrderNotification, sendLinePaymentVerifiedNotification, sendLineTrackingNotification } from '../line-api';
import { createCourierShipment } from '../courier-api';

interface DataContextType {
  products: Product[];
  orders: Order[];
  users: (UserProfile & { orders_count: number; total_spent: number })[];
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  createOrder: (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    subtotal: number;
    shipping_fee: number;
    discount: number;
    total_amount: number;
    payment_method: PaymentMethod;
    shipping_address: ShippingAddress;
    tax_invoice_required: boolean;
    tax_invoice_data?: TaxInvoiceInfo;
    items: { product: Product; quantity: number }[];
    slip_url?: string;
    slip_transferred_amount?: number;
  }) => Promise<Order>;
  verifyPaymentSlip: (orderId: string, approved: boolean, verifiedAmount?: number) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  dispatchShipment: (orderId: string, courier: CourierCode) => Promise<string>;
  updateUserByAdmin: (userId: string, updates: Partial<UserProfile>) => void;
  sendMarketingCampaign: (subject: string, content: string, filter: string) => Promise<{ sentCount: number }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [users, setUsers] = useState<(UserProfile & { orders_count: number; total_spent: number })[]>(INITIAL_USERS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem('ecom_products');
      const o = localStorage.getItem('ecom_orders');
      const u = localStorage.getItem('ecom_users');
      if (p) setProducts(JSON.parse(p));
      if (o) setOrders(JSON.parse(o));
      if (u) setUsers(JSON.parse(u));
    } catch (e) {
      console.error(e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('ecom_products', JSON.stringify(products));
        localStorage.setItem('ecom_orders', JSON.stringify(orders));
        localStorage.setItem('ecom_users', JSON.stringify(users));
      } catch (e) {
        console.error(e);
      }
    }
  }, [products, orders, users, mounted]);

  const addProduct = (prod: Omit<Product, 'id' | 'created_at'>) => {
    const newProduct: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const createOrder = async (orderData: any): Promise<Order> => {
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      status: orderData.slip_url ? 'payment_verifying' : 'pending_payment',
      subtotal: orderData.subtotal,
      shipping_fee: orderData.shipping_fee,
      discount: orderData.discount || 0,
      total_amount: orderData.total_amount,
      payment_method: orderData.payment_method,
      payment_status: orderData.slip_url ? 'verifying' : 'unpaid',
      slip_url: orderData.slip_url,
      slip_transferred_amount: orderData.slip_transferred_amount,
      slip_transferred_at: orderData.slip_url ? new Date().toISOString() : undefined,
      tax_invoice_required: orderData.tax_invoice_required,
      tax_invoice_data: orderData.tax_invoice_data,
      shipping_address: orderData.shipping_address,
      line_notified: false,
      created_at: new Date().toISOString(),
      items: orderData.items.map((it: any, index: number) => ({
        id: `item-${Date.now()}-${index}`,
        order_id: `ord-${Date.now()}`,
        product_id: it.product.id,
        title: it.product.title,
        price: it.product.price,
        quantity: it.quantity,
        image_url: it.product.images[0] || '',
        subtotal: it.product.price * it.quantity,
      })),
    };

    // Deduct stock for ordered items
    setProducts((prev) =>
      prev.map((p) => {
        const matchingItem = orderData.items.find((it: any) => it.product.id === p.id);
        if (matchingItem) {
          const newStock = Math.max(0, p.stock_quantity - matchingItem.quantity);
          return {
            ...p,
            stock_quantity: newStock,
            status: newStock === 0 ? 'out_of_stock' : p.status,
          };
        }
        return p;
      })
    );

    // Trigger LINE Notification API
    try {
      await sendLineOrderNotification(newOrder);
      newOrder.line_notified = true;
    } catch (e) {
      console.error('Failed to notify LINE', e);
    }

    setOrders((prev) => [newOrder, ...prev]);

    // Update user order count
    setUsers((prev) =>
      prev.map((u) =>
        u.email === orderData.customer_email
          ? {
              ...u,
              orders_count: (u.orders_count || 0) + 1,
              total_spent: (u.total_spent || 0) + orderData.total_amount,
            }
          : u
      )
    );

    return newOrder;
  };

  const verifyPaymentSlip = async (orderId: string, approved: boolean, verifiedAmount?: number) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const newStatus: OrderStatus = approved ? 'confirmed' : 'pending_payment';
    const newPaymentStatus = approved ? 'paid' : 'failed';

    const updated: Order = {
      ...targetOrder,
      status: newStatus,
      payment_status: newPaymentStatus,
      slip_verified_at: approved ? new Date().toISOString() : undefined,
      slip_transferred_amount: verifiedAmount ?? targetOrder.slip_transferred_amount,
    };

    if (approved) {
      await sendLinePaymentVerifiedNotification(updated);
    }

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o))
    );
  };

  const dispatchShipment = async (orderId: string, courier: CourierCode): Promise<string> => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const result = await createCourierShipment(order, courier);

    const updated: Order = {
      ...order,
      courier_code: courier,
      tracking_number: result.trackingNumber,
      status: 'shipped',
      shipped_at: new Date().toISOString(),
    };

    await sendLineTrackingNotification(updated, result.trackingNumber, courier);

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    return result.trackingNumber;
  };

  const updateUserByAdmin = (userId: string, updates: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
  };

  const sendMarketingCampaign = async (subject: string, content: string, filter: string) => {
    let filteredUsers = users.filter((u) => u.status === 'active' && u.role !== 'admin');
    if (filter === 'juristic') {
      filteredUsers = filteredUsers.filter((u) => u.account_type === 'juristic');
    } else if (filter === 'repeat_customers') {
      filteredUsers = filteredUsers.filter((u) => u.orders_count > 1);
    } else if (filter === 'inactive') {
      filteredUsers = filteredUsers.filter((u) => u.orders_count === 0);
    }

    console.log(`[Marketing Hub] Sending Gmail campaign "${subject}" to ${filteredUsers.length} users`);
    return { sentCount: filteredUsers.length };
  };

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        users,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        verifyPaymentSlip,
        updateOrderStatus,
        dispatchShipment,
        updateUserByAdmin,
        sendMarketingCampaign,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

