'use client'

import { withTierAccess } from '@/components/withTierAccess';
import { AppFrameComponent } from '@/components/app-frame'
import { MyGamesComponent } from '@/components/my-games-component'

function MyGamesPage() {
  return (
    <AppFrameComponent>
      <MyGamesComponent />
    </AppFrameComponent>
  )
}

export default withTierAccess(MyGamesPage);