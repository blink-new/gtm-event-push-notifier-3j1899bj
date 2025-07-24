import { useState } from 'react'
import { 
  BarChart3, 
  Bell, 
  Settings, 
  Users, 
  Activity, 
  CreditCard,
  Key,
  Palette,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'events', label: 'Event Monitor', icon: Activity },
  { id: 'audience', label: 'Audience', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

const settingsItems = [
  { id: 'team', label: 'Team Management', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'api', label: 'API Settings', icon: Key },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'settings', label: 'General Settings', icon: Settings },
]

export function Sidebar({ isOpen = true, onClose, activeTab = 'dashboard', onTabChange }: SidebarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleTabClick = (tabId: string) => {
    onTabChange?.(tabId)
    if (window.innerWidth < 1024) {
      onClose?.()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  activeTab === item.id && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
                onClick={() => handleTabClick(item.id)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}

            {/* Settings Section */}
            <div className="pt-6">
              <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-10 px-3"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5" />
                      Settings
                    </div>
                    {settingsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {settingsItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-9 pl-9 text-sm",
                        activeTab === item.id && "bg-primary/10 text-primary hover:bg-primary/15"
                      )}
                      onClick={() => handleTabClick(item.id)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-3 text-white">
              <h4 className="font-medium text-sm">Upgrade to Pro</h4>
              <p className="text-xs opacity-90 mt-1">
                Get unlimited events and advanced analytics
              </p>
              <Button 
                size="sm" 
                variant="secondary" 
                className="mt-2 w-full bg-white text-primary hover:bg-gray-100"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}