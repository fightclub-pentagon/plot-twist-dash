'use client'

import React, { useEffect, useState, Suspense } from 'react';
import { useUser } from '@/contexts/UserContext';
import Script from 'next/script';
import { PricingErrorBoundary } from './pricing-error-boundary';

// Fallback component for loading state
const LoadingFallback = () => (
  <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
    <div>Loading pricing options...</div>
  </div>
);

// Debug component to show configuration status
const DebugInfo = ({ config }: { config: Record<string, boolean | number> }) => (
  <pre className="mt-4 text-sm opacity-75">
    Debug Info: {JSON.stringify(config, null, 2)}
  </pre>
);

export function UpgradeMessage() {
  const { user } = useUser();
  const userId: string = user?.uid || '';
  const [isClient, setIsClient] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkCount, setCheckCount] = useState(0);
  
  const pricingTableId = process.env.NEXT_PUBLIC_PRICING_TABLE_ID || '';
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

  // Verify environment variables are loaded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.debug('Environment check:', {
        hasPricingTableId: !!process.env.NEXT_PUBLIC_PRICING_TABLE_ID,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      });
    }
  }, []);

  // Initialize client-side state and check custom element
  useEffect(() => {
    if (!pricingTableId || !publishableKey) {
      setError('Missing Stripe configuration. Please check environment variables.');
      return;
    }

    const checkCustomElement = () => {
      if (window.customElements.get('stripe-pricing-table')) {
        console.log('Custom element found on initialization');
        setScriptLoaded(true);
        return;
      }
      
      if (checkCount < 50) { // Try for 5 seconds
        setCheckCount(prev => prev + 1);
        setTimeout(checkCustomElement, 100);
      } else {
        setError('Failed to initialize Stripe pricing table after multiple attempts');
      }
    };

    setIsClient(true);
    checkCustomElement();
  }, [pricingTableId, publishableKey, checkCount]);

  // Handle Stripe errors
  useEffect(() => {
    const handleStripeError = (event: CustomEvent) => {
      console.error('Stripe pricing table error:', event.detail);
      setError(event.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('stripe-pricing-table-error', handleStripeError as EventListener);
      
      return () => {
        window.removeEventListener('stripe-pricing-table-error', handleStripeError as EventListener);
      };
    }
  }, []);

  // Handle script loading
  const handleScriptLoad = () => {
    console.log('Stripe script loaded, checking for custom element availability...');
    setScriptLoaded(true);
  };

  const handleScriptError = (e: Error | string) => {
    console.error('Failed to load Stripe script:', e);
    setError('Failed to load Stripe script');
  };

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
        <DebugInfo config={{
          pricingTableId: !!pricingTableId,
          publishableKey: !!publishableKey,
          userId: !!userId,
          isClient,
          scriptLoaded,
          checkCount
        }} />
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <PricingErrorBoundary fallback={
        <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
          <p className="text-red-500">Something went wrong loading the pricing table.</p>
        </div>
      }>
        <div className="bg-gray-900 min-h-screen">
          <Script
            src="https://js.stripe.com/v3/pricing-table.js"
            onLoad={handleScriptLoad}
            onError={handleScriptError}
            strategy="afterInteractive"
            nonce="stripe-pricing-table"
          />
          <div className="container mx-auto px-4 py-8 bg-gray-900">
            <h2 className="text-3xl font-bold text-center mb-4 text-white">Choose Your Plan</h2>
            {isClient && window?.customElements?.get('stripe-pricing-table') ? (
              <stripe-pricing-table
                pricing-table-id={pricingTableId}
                publishable-key={publishableKey}
                client-reference-id={userId}>
              </stripe-pricing-table>
            ) : (
              <div className="text-white text-center py-12">
                <div>{!isClient ? "Initializing..." : "Loading pricing table..."}</div>
                <div className="text-sm mt-2 opacity-75">
                  Client: {isClient ? '✓' : '×'} | Script: {scriptLoaded ? '✓' : '×'} | Attempts: {checkCount}
                </div>
              </div>
            )}
          </div>
        </div>
      </PricingErrorBoundary>
    </Suspense>
  );
}