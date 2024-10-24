'use client'

import { PricingTableComponent } from '@/components/pricing-table';
import { StripePricingTable } from '@/components/StripePricingTable';
import { useUser } from '@/contexts/UserContext';

//pricingTableId="prctbl_1QBftrCfSvaJZHjJsKc9bUZR"
//publishableKey="pk_live_51N3jbdCfSvaJZHjJLmXHUhhKdmQi2WURgMAiWKvjlGtmXNPAes6bhm0LRB5ddXlrrgd21ns446DdEWjRtZ2ETS5z00pFDkLrAS"
/**<StripePricingTable
          pricingTableId="prctbl_1QDA8RCfSvaJZHjJLnqaflAU"
          publishableKey="pk_test_51N3jbdCfSvaJZHjJDVcESjQ6lkb3zQQ5FneTvcoLZBowWS8IU046ixXvXbRnviXkhTgTf9hXbgo2eOr9SnrXJbAM00yAS0qwj4"
          clientReferenceId={user?.uid}
        /> */
export default function PricingPage() {
  const { user } = useUser();

  return (
    <div className="bg-gray-900 min-h-screen">
      <PricingTableComponent />
    </div>
  );
}
