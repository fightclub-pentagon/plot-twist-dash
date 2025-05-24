'use client'

import { useEffect } from 'react';
import { UpgradeMessage } from '@/components/upgrade-message';
import dynamic from 'next/dynamic';
import { PricingErrorBoundary } from '@/components/pricing-error-boundary';

// Wrap the component with error boundary and disable SSR
const DynamicUpgradeMessage = dynamic(
  () => Promise.resolve(UpgradeMessage),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
        <div>Loading pricing page...</div>
      </div>
    )
  }
);

export default function PricingPage() {
  useEffect(() => {
    // Add timestamp to help track when logs occur
    console.log('Pricing page mounted at:', new Date().toISOString());
    
    // Log environment variables availability
    console.debug('Environment check on pricing page:', {
      hasPricingTableId: !!process.env.NEXT_PUBLIC_PRICING_TABLE_ID,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      isDev: process.env.NODE_ENV === 'development',
      timestamp: new Date().toISOString()
    });

    // Check if Stripe script is already present
    const stripeScript = document.querySelector('script[src*="stripe"]');
    console.debug('Stripe script status:', {
      exists: !!stripeScript,
      src: stripeScript?.getAttribute('src'),
      timestamp: new Date().toISOString()
    });

    return () => {
      console.log('Pricing page unmounting at:', new Date().toISOString());
    };
  }, []);

  return (
    <PricingErrorBoundary
      fallback={
        <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">Unable to load pricing information</h2>
          <p className="text-gray-400">Please try refreshing the page</p>
          <p className="text-sm mt-4 text-gray-500">Time: {new Date().toISOString()}</p>
        </div>
      }
    >
      <div className="bg-gray-900 min-h-screen">
        <DynamicUpgradeMessage />
      </div>
    </PricingErrorBoundary>
  );
}
