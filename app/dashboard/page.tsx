import { AppFrameComponent } from '@/components/app-frame'

export default function DashboardPage() {
  return (
    <AppFrameComponent>
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-white mt-12 mb-4">Welcome to your Plot Twist dashboard!</h1>
        <p className="text-gray-300 mt-12">Explore the app in the navigation bar bellow 👇</p>
      </div>
    </AppFrameComponent>
  )
}
