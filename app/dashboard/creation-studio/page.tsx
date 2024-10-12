'use client'

import { withTierAccess } from '@/components/withTierAccess';
import { AppFrameComponent } from '@/components/app-frame'
import { GameCreatorComponent } from '@/components/game-creator'

function CreationStudioPage() {
  return (
    <AppFrameComponent>
      <div className="p-4">
        <GameCreatorComponent />
      </div>
    </AppFrameComponent>
  )
}

export default withTierAccess(CreationStudioPage);