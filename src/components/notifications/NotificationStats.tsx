import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Users, MousePointer, TrendingUp } from 'lucide-react'

interface Notification {
  id: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  totalSent: number
  totalDelivered: number
  totalClicked: number
}

interface NotificationStatsProps {
  notifications: Notification[]
}

export function NotificationStats({ notifications }: NotificationStatsProps) {
  const stats = {
    totalNotifications: notifications.length,
    activeNotifications: notifications.filter(n => n.status === 'active').length,
    totalSent: notifications.reduce((sum, n) => sum + n.totalSent, 0),
    totalClicked: notifications.reduce((sum, n) => sum + n.totalClicked, 0),
    clickRate: 0
  }

  stats.clickRate = stats.totalSent > 0 ? (stats.totalClicked / stats.totalSent) * 100 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          <Send className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalNotifications}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeNotifications} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notifications Sent</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Across all campaigns
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          <MousePointer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalClicked.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            User interactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.clickRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Average engagement
          </p>
        </CardContent>
      </Card>
    </div>
  )
}