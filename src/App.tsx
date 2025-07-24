import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import { EventMonitor } from '@/components/events/EventMonitor'
import { AudiencePage } from '@/components/audience/AudiencePage'
import { NotificationsPage } from '@/components/notifications/NotificationsPage'
import { blink } from '@/blink/client'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">GTM</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">GTM Event Tracker</h1>
          <p className="text-gray-600 mb-8">
            Collect website events from Google Tag Manager and send automated web push notifications.
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'events':
        return <EventMonitor />
      case 'audience':
        return <AudiencePage />
      case 'notifications':
        return <NotificationsPage />
      case 'analytics':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Advanced analytics coming soon...</p>
          </div>
        )
      case 'team':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Management</h2>
            <p className="text-gray-600">Team management features coming soon...</p>
          </div>
        )
      case 'billing':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Billing</h2>
            <p className="text-gray-600">Billing and subscription management coming soon...</p>
          </div>
        )
      case 'api':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Settings</h2>
            <p className="text-gray-600">API configuration coming soon...</p>
          </div>
        )
      case 'branding':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Branding</h2>
            <p className="text-gray-600">Custom branding options coming soon...</p>
          </div>
        )
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">General settings coming soon...</p>
          </div>
        )
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        companyName="Acme Corp"
        userName={user.displayName || user.email?.split('@')[0] || 'User'}
        userEmail={user.email}
        notificationCount={3}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App