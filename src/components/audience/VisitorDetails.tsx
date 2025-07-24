import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Activity,
  Eye,
  MousePointer,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react'
import { visitorTrackingService, VisitorProfile, VisitorEvent, VisitorSession } from '@/services/visitorTracking'

interface VisitorDetailsProps {
  visitorId: string
  onBack: () => void
}

export function VisitorDetails({ visitorId, onBack }: VisitorDetailsProps) {
  const [profile, setProfile] = useState<VisitorProfile | null>(null)
  const [events, setEvents] = useState<VisitorEvent[]>([])
  const [sessions, setSessions] = useState<VisitorSession[]>([])
  const [loading, setLoading] = useState(true)

  const loadVisitorData = useCallback(async () => {
    setLoading(true)
    try {
      const [profileData, eventsData, sessionsData] = await Promise.all([
        visitorTrackingService.getVisitorProfile(visitorId),
        visitorTrackingService.getVisitorEvents(visitorId, 200),
        visitorTrackingService.getVisitorSessions(visitorId)
      ])
      
      setProfile(profileData)
      setEvents(eventsData)
      setSessions(sessionsData)
    } catch (error) {
      console.error('Failed to load visitor data:', error)
    } finally {
      setLoading(false)
    }
  }, [visitorId])

  useEffect(() => {
    loadVisitorData()
  }, [loadVisitorData])

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getEventIcon = (eventName: string) => {
    switch (eventName) {
      case 'page_view':
        return <Eye className="h-4 w-4" />
      case 'click':
        return <MousePointer className="h-4 w-4" />
      case 'purchase_completed':
        return <Activity className="h-4 w-4 text-green-600" />
      case 'add_to_cart':
        return <Activity className="h-4 w-4 text-blue-600" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visitor details...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Visitor not found</h3>
        <p className="text-gray-500 mb-4">The requested visitor could not be found.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Audience
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visitor Details</h2>
          <p className="text-gray-600">Complete activity history for visitor {visitorId.slice(-8)}</p>
        </div>
      </div>

      {/* Visitor Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">First Seen</p>
                <p className="text-sm font-medium">{formatTimestamp(profile.firstSeen)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-xl font-bold">{profile.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-xl font-bold">{profile.totalPageViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-xl font-bold">{profile.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device & Location Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {profile.deviceInfo.device === 'mobile' ? 
                <Smartphone className="h-5 w-5" /> : 
                <Monitor className="h-5 w-5" />
              }
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Device Type:</span>
              <Badge variant="outline">{profile.deviceInfo.device}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Browser:</span>
              <span className="font-medium">{profile.deviceInfo.browser}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Operating System:</span>
              <span className="font-medium">{profile.deviceInfo.os}</span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600 mb-1">User Agent:</p>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                {profile.deviceInfo.userAgent}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Acquisition & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Referrer:</span>
              <span className="font-medium text-sm">
                {profile.acquisitionInfo.referrer ? 
                  new URL(profile.acquisitionInfo.referrer).hostname : 
                  'Direct'
                }
              </span>
            </div>
            {profile.acquisitionInfo.utmSource && (
              <div className="flex justify-between">
                <span className="text-gray-600">UTM Source:</span>
                <Badge variant="outline">{profile.acquisitionInfo.utmSource}</Badge>
              </div>
            )}
            {profile.locationInfo.country && (
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">
                  {profile.locationInfo.city}, {profile.locationInfo.country}
                </span>
              </div>
            )}
            {profile.locationInfo.ipAddress && (
              <div className="flex justify-between">
                <span className="text-gray-600">IP Address:</span>
                <span className="font-mono text-sm">{profile.locationInfo.ipAddress}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">All Events ({events.length})</TabsTrigger>
          <TabsTrigger value="sessions">Sessions ({sessions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
              <CardDescription>Complete chronological history of visitor activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getEventIcon(event.eventName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono text-xs">
                          {event.eventName}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-2">{event.pageTitle || 'Untitled Page'}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Globe className="h-3 w-3" />
                        <span className="truncate">{event.pageUrl}</span>
                        <Button variant="ghost" size="sm" className="h-auto p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      {Object.keys(event.eventData).length > 0 && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                            Event Data
                          </summary>
                          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(event.eventData, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
                
                {events.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-500">This visitor hasn't generated any events yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>Individual browsing sessions and their details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.sessionId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {session.sessionId.slice(-8)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(session.startedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatDuration(session.durationSeconds)}</span>
                        <span>{session.pageViews} pages</span>
                        <span>{session.eventsCount} events</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Entry Page:</p>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded truncate">
                          {session.entryPage}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Exit Page:</p>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded truncate">
                          {session.exitPage}
                        </p>
                      </div>
                    </div>
                    
                    {session.referrer && (
                      <div className="mt-3">
                        <p className="text-gray-600 text-sm mb-1">Referrer:</p>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded truncate">
                          {session.referrer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {sessions.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
                    <p className="text-gray-500">This visitor hasn't had any recorded sessions yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}