import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  Download, 
  Play, 
  Pause,
  Activity,
  Clock,
  Globe,
  User,
  RefreshCw,
  Eye,
  MousePointer,
  Zap
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { visitorTrackingService, VisitorEvent, VisitorProfile } from '@/services/visitorTracking'

export function EventMonitor() {
  const [isLive, setIsLive] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [eventFilter, setEventFilter] = useState("all")
  const [events, setEvents] = useState<VisitorEvent[]>([])
  const [visitors, setVisitors] = useState<VisitorProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    eventsPerMinute: 0,
    activeSessions: 0,
    uniquePages: 0
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const [eventsData, visitorsData] = await Promise.all([
        visitorTrackingService.getVisitorEvents(undefined, 200),
        visitorTrackingService.getVisitorProfiles(100)
      ])
      
      setEvents(eventsData)
      setVisitors(visitorsData)
      
      // Calculate stats
      const now = Date.now()
      const oneMinuteAgo = now - 60000
      const recentEvents = eventsData.filter(e => new Date(e.timestamp).getTime() > oneMinuteAgo)
      const uniquePages = new Set(eventsData.map(e => e.pageUrl)).size
      
      setStats({
        eventsPerMinute: recentEvents.length,
        activeSessions: visitorsData.length,
        uniquePages
      })
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Auto-refresh every 30 seconds if live
    const interval = setInterval(() => {
      if (isLive) {
        loadData()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [isLive])

  const generateDemoEvent = async () => {
    const demoEvents = [
      { name: 'page_view', data: { page: '/home', title: 'Homepage' }, url: 'https://example.com/home' },
      { name: 'page_view', data: { page: '/products', title: 'Products' }, url: 'https://example.com/products' },
      { name: 'click', data: { element: 'cta-button', text: 'Shop Now' }, url: 'https://example.com/home' },
      { name: 'add_to_cart', data: { product_id: 'prod_123', price: 29.99, name: 'Widget' }, url: 'https://example.com/products/widget' },
      { name: 'page_view', data: { page: '/checkout', title: 'Checkout' }, url: 'https://example.com/checkout' },
      { name: 'purchase_completed', data: { transaction_id: 'txn_' + Date.now(), value: 29.99, currency: 'USD' }, url: 'https://example.com/success' }
    ]
    
    const randomEvent = demoEvents[Math.floor(Math.random() * demoEvents.length)]
    await visitorTrackingService.simulateGTMEvent(randomEvent.name, randomEvent.data)
    loadData()
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.pageUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.visitorId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = eventFilter === "all" || event.eventName === eventFilter
    return matchesSearch && matchesFilter
  })

  // Group events by visitor
  const eventsByVisitor = filteredEvents.reduce((acc, event) => {
    if (!acc[event.visitorId]) {
      acc[event.visitorId] = []
    }
    acc[event.visitorId].push(event)
    return acc
  }, {} as Record<string, VisitorEvent[]>)

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatData = (data: any) => {
    return JSON.stringify(data, null, 2)
  }

  const getEventIcon = (eventName: string) => {
    switch (eventName) {
      case 'page_view':
        return <Eye className="h-4 w-4 text-blue-600" />
      case 'click':
        return <MousePointer className="h-4 w-4 text-green-600" />
      case 'purchase_completed':
        return <Zap className="h-4 w-4 text-purple-600" />
      case 'add_to_cart':
        return <Activity className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getVisitorInfo = (visitorId: string) => {
    return visitors.find(v => v.visitorId === visitorId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Monitor</h2>
          <p className="text-gray-600">Real-time GTM event tracking with visitor context</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2"
          >
            {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isLive ? "Pause" : "Resume"} Live
          </Button>
          
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={generateDemoEvent} variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Demo Event
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Events/min</p>
                <p className="text-xl font-bold">{stats.eventsPerMinute}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Visitors</p>
                <p className="text-xl font-bold">{stats.activeSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unique Pages</p>
                <p className="text-xl font-bold">{stats.uniquePages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isLive ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-xl font-bold">{isLive ? 'Live' : 'Paused'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events, URLs, or visitor IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="page_view">Page Views</SelectItem>
                <SelectItem value="click">Clicks</SelectItem>
                <SelectItem value="purchase_completed">Purchases</SelectItem>
                <SelectItem value="add_to_cart">Add to Cart</SelectItem>
                <SelectItem value="user_signup">Sign Ups</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Display */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Event Timeline ({filteredEvents.length})</TabsTrigger>
          <TabsTrigger value="visitors">By Visitor ({Object.keys(eventsByVisitor).length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Event Stream
              </CardTitle>
              <CardDescription>
                Real-time chronological stream of all GTM events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading events...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => {
                    const visitorInfo = getVisitorInfo(event.visitorId)
                    return (
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getEventIcon(event.eventName)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {event.eventName}
                                </Badge>
                                <Badge variant="secondary" className="font-mono text-xs">
                                  {event.visitorId.slice(-8)}
                                </Badge>
                                {visitorInfo && (
                                  <Badge variant="outline" className="text-xs">
                                    {visitorInfo.deviceInfo.device} • {visitorInfo.deviceInfo.browser}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(event.timestamp)}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Page:</p>
                            <p className="font-medium">{event.pageTitle || 'Untitled Page'}</p>
                            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all mt-1">
                              {event.pageUrl}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600 mb-1">Session:</p>
                            <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                              {event.sessionId.slice(-12)}
                            </p>
                          </div>
                        </div>
                        
                        {Object.keys(event.eventData).length > 0 && (
                          <div className="mt-3">
                            <p className="text-gray-600 mb-2">Event Data:</p>
                            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                              {formatData(event.eventData)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  
                  {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm || eventFilter !== "all" 
                          ? "Try adjusting your filters or search terms"
                          : "Events will appear here when they start coming in"
                        }
                      </p>
                      <Button onClick={generateDemoEvent} variant="outline">
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Demo Event
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Events Grouped by Visitor
              </CardTitle>
              <CardDescription>
                View events organized by individual visitor sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(eventsByVisitor).map(([visitorId, visitorEvents]) => {
                  const visitorInfo = getVisitorInfo(visitorId)
                  return (
                    <div key={visitorId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="font-mono text-xs">
                                {visitorId.slice(-8)}
                              </Badge>
                              {visitorInfo && (
                                <Badge variant="secondary" className="text-xs">
                                  {visitorInfo.deviceInfo.device} • {visitorInfo.deviceInfo.browser}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {visitorEvents.length} events • Last active: {formatTimestamp(visitorEvents[0].timestamp)}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Full Profile
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {visitorEvents.slice(0, 5).map((event) => (
                          <div key={event.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div className="p-1 bg-white rounded">
                              {getEventIcon(event.eventName)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">{event.eventName}</span>
                                <span className="text-xs text-gray-500 truncate">
                                  {event.pageTitle || event.pageUrl}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(event.timestamp)}
                            </span>
                          </div>
                        ))}
                        
                        {visitorEvents.length > 5 && (
                          <div className="text-center pt-2">
                            <Button variant="ghost" size="sm" className="text-xs">
                              Show {visitorEvents.length - 5} more events
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                
                {Object.keys(eventsByVisitor).length === 0 && (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No visitor events found</h3>
                    <p className="text-gray-500 mb-4">
                      Events grouped by visitor will appear here
                    </p>
                    <Button onClick={generateDemoEvent} variant="outline">
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Demo Event
                    </Button>
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