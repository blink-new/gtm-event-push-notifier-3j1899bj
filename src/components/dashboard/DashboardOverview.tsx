import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Bell, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { GTMIntegrationGuide } from '@/components/guides/GTMIntegrationGuide'

const stats = [
  {
    title: "Events Today",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Activity,
    color: "text-blue-600"
  },
  {
    title: "Notifications Sent",
    value: "1,234",
    change: "+8.2%",
    trend: "up", 
    icon: Bell,
    color: "text-green-600"
  },
  {
    title: "Active Subscribers",
    value: "8,921",
    change: "+3.1%",
    trend: "up",
    icon: Users,
    color: "text-purple-600"
  },
  {
    title: "Click Rate",
    value: "24.8%",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
    color: "text-orange-600"
  }
]

const recentEvents = [
  {
    id: "1",
    name: "purchase_completed",
    count: 45,
    lastSeen: "2 minutes ago",
    status: "active"
  },
  {
    id: "2", 
    name: "page_view",
    count: 1247,
    lastSeen: "1 minute ago",
    status: "active"
  },
  {
    id: "3",
    name: "add_to_cart",
    count: 89,
    lastSeen: "5 minutes ago", 
    status: "active"
  },
  {
    id: "4",
    name: "user_signup",
    count: 12,
    lastSeen: "8 minutes ago",
    status: "warning"
  }
]

const recentNotifications = [
  {
    id: "1",
    title: "Welcome to our store!",
    trigger: "user_signup",
    sent: "3 minutes ago",
    status: "delivered",
    recipients: 1
  },
  {
    id: "2",
    title: "Complete your purchase",
    trigger: "cart_abandonment", 
    sent: "15 minutes ago",
    status: "delivered",
    recipients: 23
  },
  {
    id: "3",
    title: "Flash sale ending soon!",
    trigger: "time_based",
    sent: "1 hour ago", 
    status: "delivered",
    recipients: 456
  }
]

export function DashboardOverview() {
  const [showGTMGuide, setShowGTMGuide] = useState(false)

  return (
    <>
      <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last week</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest GTM events from your website</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      event.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{event.name}</p>
                      <p className="text-xs text-gray-500">{event.count} events</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.lastSeen}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Latest push notifications sent</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start justify-between p-3 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-500">
                        Triggered by: <span className="font-medium">{notification.trigger}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.recipients} recipient{notification.recipients !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {notification.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{notification.sent}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-auto p-4 flex flex-col items-start gap-2" 
              variant="outline"
              onClick={() => setShowGTMGuide(true)}
            >
              <Activity className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">Setup GTM Integration</p>
                <p className="text-xs text-gray-500">Connect your Google Tag Manager</p>
              </div>
            </Button>
            
            <Button className="h-auto p-4 flex flex-col items-start gap-2" variant="outline">
              <Bell className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">Create Notification Rule</p>
                <p className="text-xs text-gray-500">Set up automated push notifications</p>
              </div>
            </Button>
            
            <Button className="h-auto p-4 flex flex-col items-start gap-2" variant="outline">
              <Users className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">Invite Team Members</p>
                <p className="text-xs text-gray-500">Collaborate with your team</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* GTM Integration Guide Modal */}
      {showGTMGuide && (
        <GTMIntegrationGuide onClose={() => setShowGTMGuide(false)} />
      )}
    </>
  )
}