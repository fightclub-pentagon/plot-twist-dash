'use client';

import { useEffect, useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'pricing-table-id': string;
        'publishable-key': string;
        'client-reference-id'?: string;
      };
    }
  }
}

interface StripePricingTableProps {
  pricingTableId: string;
  publishableKey: string;
  clientReferenceId?: string;
}

export function StripePricingTable({ pricingTableId, publishableKey, clientReferenceId }: StripePricingTableProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isScriptLoaded) {
    return <div>Loading pricing table...</div>;
  }

  return (
    <div className={`w-full ${window.outerWidth > 1000 ? 'overflow-x-auto' : ''}`}>
      <stripe-pricing-table
        pricing-table-id={pricingTableId}
        publishable-key={publishableKey}
        client-reference-id={clientReferenceId}
        className="w-full"
      />
    </div>
  );
}
