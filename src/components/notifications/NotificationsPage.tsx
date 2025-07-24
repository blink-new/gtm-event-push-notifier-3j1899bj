import { useState, useEffect } from 'react'
import { Plus, Send, Users, Clock, BarChart3, Settings, Play, Pause, Trash2, Edit, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreateNotificationDialog } from './CreateNotificationDialog'
import { NotificationStats } from './NotificationStats'
import { AudienceSelector } from './AudienceSelector'
import { blink } from '@/blink/client'

interface Notification {
  id: string
  name: string
  title: string
  message: string
  iconUrl?: string
  actionUrl?: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  audienceType: 'all_visitors' | 'segment' | 'custom'
  audienceCriteria?: any
  selectedVisitorIds?: string[]
  triggerType: 'immediate' | 'scheduled' | 'event_based'
  triggerConfig?: any
  scheduledAt?: string
  totalSent: number
  totalDelivered: number
  totalClicked: number
  createdAt: string
  updatedAt: string
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const user = await blink.auth.me()
      const result = await blink.db.notifications.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      setNotifications(result)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleCreateNotification = async (notificationData: any) => {
    try {
      const user = await blink.auth.me()
      const newNotification = await blink.db.notifications.create({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        ...notificationData,
        totalSent: 0,
        totalDelivered: 0,
        totalClicked: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      setNotifications(prev => [newNotification, ...prev])
      setCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create notification:', error)
    }
  }

  const handleStatusChange = async (notificationId: string, newStatus: string) => {
    try {
      await blink.db.notifications.update(notificationId, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, status: newStatus as any } : n)
      )
    } catch (error) {
      console.error('Failed to update notification status:', error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await blink.db.notifications.delete(notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAudienceLabel = (notification: Notification) => {
    switch (notification.audienceType) {
      case 'all_visitors': return 'All Visitors'
      case 'segment': return 'Segment'
      case 'custom': return `${notification.selectedVisitorIds?.length || 0} Selected`
      default: return 'Unknown'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true
    return notification.status === activeTab
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">Create and manage web push notifications for your visitors</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Create and manage web push notifications for your visitors</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Notification
            </Button>
          </DialogTrigger>
          <CreateNotificationDialog onSubmit={handleCreateNotification} />
        </Dialog>
      </div>

      {/* Stats */}
      <NotificationStats notifications={notifications} />

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>
            Manage your web push notification campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="draft">Draft ({notifications.filter(n => n.status === 'draft').length})</TabsTrigger>
              <TabsTrigger value="active">Active ({notifications.filter(n => n.status === 'active').length})</TabsTrigger>
              <TabsTrigger value="paused">Paused ({notifications.filter(n => n.status === 'paused').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({notifications.filter(n => n.status === 'completed').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'all' ? 'No notifications yet' : `No ${activeTab} notifications`}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first web push notification to engage with your visitors
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Notification
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card key={notification.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">{notification.name}</h3>
                              <Badge className={getStatusColor(notification.status)}>
                                {notification.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-primary">
                                <p className="font-medium text-gray-900">{notification.title}</p>
                                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {getAudienceLabel(notification)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {notification.triggerType === 'immediate' ? 'Send immediately' : 
                                 notification.triggerType === 'scheduled' ? 'Scheduled' : 'Event-based'}
                              </div>
                              <div className="flex items-center gap-1">
                                <BarChart3 className="h-4 w-4" />
                                {notification.totalSent} sent, {notification.totalClicked} clicked
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            {notification.status === 'draft' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(notification.id, 'active')}
                                className="gap-1"
                              >
                                <Play className="h-3 w-3" />
                                Activate
                              </Button>
                            )}
                            {notification.status === 'active' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(notification.id, 'paused')}
                                className="gap-1"
                              >
                                <Pause className="h-3 w-3" />
                                Pause
                              </Button>
                            )}
                            {notification.status === 'paused' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(notification.id, 'active')}
                                className="gap-1"
                              >
                                <Play className="h-3 w-3" />
                                Resume
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="gap-1">
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}