'use client';

import React from 'react';
import { AuthProvider, useAuth } from '../lib/store/auth';
import { CartProvider } from '../lib/store/cart';
import { DataProvider } from '../lib/store/data';
import { OnboardingModal } from './OnboardingModal';

const OnboardingGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { needsOnboarding } = useAuth();
  return (
    <>
      {children}
      <OnboardingModal isOpen={needsOnboarding} />
    </>
  );
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <OnboardingGate>{children}</OnboardingGate>
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  );
};

