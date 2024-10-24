import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { PricingTableComponent } from './pricing-table';

export function UpgradeMessage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <PricingTableComponent />
    </div>
  );
}