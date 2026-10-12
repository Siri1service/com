'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AccountType } from '../supabase/types';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { INITIAL_USERS } from '../mock-data';

export interface OnboardingData {
  account_type: AccountType;
  tax_id?: string;
  company_name?: string;
  branch_id?: string;
  phone: string;
  full_name: string;
  shipping_address: {
    recipient_name: string;
    phone: string;
    address_line1: string;
    subdistrict: string;
    district: string;
    province: string;
    postal_code: string;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  needsOnboarding: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  switchRole: (role: 'admin' | 'customer') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to demo customer or saved user
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ecom_current_user');
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Default demo customer (somchai)
        setUser(INITIAL_USERS[1]);
      }
    } catch (e) {
      console.error(e);
      setUser(INITIAL_USERS[1]);
    }
    setLoading(false);
  }, []);

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('ecom_current_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('ecom_current_user');
    }
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : undefined,
        },
      });
      return;
    }

    // Demo Mode Google Login: simulate new user needing onboarding
    const newUser: UserProfile = {
      id: `usr-google-${Date.now()}`,
      email: 'user.google@gmail.com',
      full_name: 'ผู้ใช้ใหม่ (Google Account)',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      account_type: 'individual',
      role: 'customer',
      onboarding_completed: false, // Triggers first-time onboarding!
      status: 'active',
      created_at: new Date().toISOString(),
    };
    saveUser(newUser);
  };

  const loginWithFacebook = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : undefined,
        },
      });
      return;
    }

    // Demo Mode Facebook Login
    const newUser: UserProfile = {
      id: `usr-fb-${Date.now()}`,
      email: 'user.facebook@example.com',
      full_name: 'ผู้ใช้ใหม่ (Facebook Account)',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      account_type: 'individual',
      role: 'customer',
      onboarding_completed: false, // Triggers first-time onboarding!
      status: 'active',
      created_at: new Date().toISOString(),
    };
    saveUser(newUser);
  };

  const loginWithEmail = async (email: string) => {
    const existing = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      saveUser(existing);
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      account_type: 'individual',
      role: email.includes('admin') ? 'admin' : 'customer',
      onboarding_completed: false,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    saveUser(newUser);
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    saveUser(null);
  };

  const completeOnboarding = async (data: OnboardingData) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      full_name: data.full_name || user.full_name,
      phone: data.phone,
      account_type: data.account_type,
      tax_id: data.tax_id,
      company_name: data.company_name,
      branch_id: data.branch_id || '00000',
      onboarding_completed: true,
    };
    saveUser(updated);

    // Save default shipping address
    try {
      localStorage.setItem('ecom_default_address', JSON.stringify(data.shipping_address));
    } catch (e) {
      console.error(e);
    }
  };

  const switchRole = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      saveUser(INITIAL_USERS[0]); // usr-admin
    } else {
      saveUser(INITIAL_USERS[1]); // somchai
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        needsOnboarding: Boolean(user && !user.onboarding_completed),
        loginWithGoogle,
        loginWithFacebook,
        loginWithEmail,
        logout,
        completeOnboarding,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

