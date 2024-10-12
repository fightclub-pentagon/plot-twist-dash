'use client'

import { withTierAccess } from '@/components/withTierAccess';
import { AppFrameComponent } from '@/components/app-frame'
import { MobileCarouselComponent } from '@/components/mobile-carousel'

function CommunityGamesPage() {
  return (
    <AppFrameComponent>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Community Games</h1>
        <p className="text-gray-300">Explore games created by the community.</p>
      </div>
      <div className='mx-4 my-6'>
        <MobileCarouselComponent title='Top Rated' />
      </div>
      <div className='mx-4 my-6'>
        <MobileCarouselComponent title='Favourites' />
      </div>
      <div className='mx-4 my-6'>
        <MobileCarouselComponent title='Recently Played' />
      </div>
    </AppFrameComponent>
  );
}

export default withTierAccess(CommunityGamesPage);
