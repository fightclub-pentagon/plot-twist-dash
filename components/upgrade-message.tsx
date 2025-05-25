import React, { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';

export function UpgradeMessage() {
  const { user } = useUser();
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);
  const userId = user?.uid || '';
  
  // Remove the state for these values since they're static
  const pricingTableId = process.env.NEXT_PUBLIC_PRICING_TABLE_ID || "";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    script.onload = () => setIsStripeLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array since we're only loading the script once

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">Choose Your Plan</h2>
        {isStripeLoaded && (
          <stripe-pricing-table
            pricing-table-id={pricingTableId}
            publishable-key={publishableKey}
            client-reference-id={userId}>
          </stripe-pricing-table>
        )}
      </div>
    </div>
  );
}