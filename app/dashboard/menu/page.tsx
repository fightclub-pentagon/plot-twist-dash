import { AppFrameComponent } from '@/components/app-frame'
import { SignOutButton } from '@/components/signout-btn'

export default function MenuPage() {
  return (
    <AppFrameComponent>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Menu</h1>
        <p className="text-gray-300">Access settings and other options.</p>
        <SignOutButton />
      </div>
    </AppFrameComponent>
  )
}
