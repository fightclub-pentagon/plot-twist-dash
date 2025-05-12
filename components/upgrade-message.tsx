import React from 'react';
import { PricingTableComponent } from './pricing-table';
import { OneTimePricingTableComponent } from './pricing-table-onetime-products';
import { useUser } from '@/contexts/UserContext';

export function UpgradeMessage() {
  const { user } = useUser();
  const userId: string = user?.uid || '';
  const pricingTableId = process.env.NEXT_PUBLIC_PRICING_TABLE_ID || '';
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  console.log('PricingTableId and PublishableKey:', pricingTableId, publishableKey);
  return (
    <div className="bg-gray-900 min-h-screen">
      {false && <PricingTableComponent />}
      {false && <OneTimePricingTableComponent />}
      <div className="container mx-auto px-4 py-8 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">Choose Your Plan</h2>
        <stripe-pricing-table
          pricing-table-id={pricingTableId}
          publishable-key={publishableKey}
          client-reference-id={userId}>
        </stripe-pricing-table>
      </div>
    </div>
  );
}