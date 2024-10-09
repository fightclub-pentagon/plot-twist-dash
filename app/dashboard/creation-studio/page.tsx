import { AppFrameComponent } from '@/components/app-frame'
import { GameCreatorComponent } from '@/components/game-creator'

export default function CreationStudioPage() {
  return (
    <AppFrameComponent>
      <div className="p-4">
        <GameCreatorComponent />
      </div>
    </AppFrameComponent>
  )
}
