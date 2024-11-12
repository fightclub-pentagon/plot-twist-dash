import React from 'react';
import { PricingTableComponent } from './pricing-table';

export function UpgradeMessage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      {false && <PricingTableComponent />}
      <div className="text-white">
        <h1>Page not available during beta phase</h1>
      </div>
    </div>
  );
}