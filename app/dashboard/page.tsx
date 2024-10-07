import { AppFrameComponent } from '@/components/app-frame'

export default function DashboardPage() {
  return (
    <AppFrameComponent>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Dashboard</h1>
        <p className="text-gray-300">Welcome to your Plot Twist dashboard!</p>
      </div>
    </AppFrameComponent>
  )
}
