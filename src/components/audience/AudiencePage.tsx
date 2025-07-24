import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Users, 
  Eye, 
  Activity,
  Clock,
  Smartphone,
  Monitor,
  Globe,
  TrendingUp,
  RefreshCw,
  UserPlus
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { visitorTrackingService, VisitorProfile } from '@/services/visitorTracking'
import { VisitorDetails } from './VisitorDetails'

export function AudiencePage() {
  const [visitors, setVisitors] = useState<VisitorProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deviceFilter, setDeviceFilter] = useState("all")
  const [selectedVisitor, setSelectedVisitor] = useState<string | null>(null)

  const loadVisitors = useCallback(async () => {
    setLoading(true)
    try {
      const profiles = await visitorTrackingService.getVisitorProfiles(100)
      setVisitors(profiles)
    } catch (error) {
      console.error('Failed to load visitors:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const generateDemoData = useCallback(async () => {
    // Generate some demo visitor data if none exists
    const existingVisitors = await visitorTrackingService.getVisitorProfiles()
    if (existingVisitors.length === 0) {
      const demoEvents = [
        { name: 'page_view', data: { page: '/home' }, url: 'https://example.com/home' },
        { name: 'page_view', data: { page: '/products' }, url: 'https://example.com/products' },
        { name: 'add_to_cart', data: { product_id: 'prod_123', price: 29.99 }, url: 'https://example.com/products/item' },
        { name: 'page_view', data: { page: '/checkout' }, url: 'https://example.com/checkout' },
        { name: 'purchase_completed', data: { transaction_id: 'txn_456', value: 29.99 }, url: 'https://example.com/success' }
      ]
      
      for (const event of demoEvents) {
        await visitorTrackingService.simulateGTMEvent(event.name, event.data)
        await new Promise(resolve => setTimeout(resolve, 100)) // Small delay between events
      }
      
      // Reload visitors after generating demo data
      loadVisitors()
    }
  }, [loadVisitors])

  useEffect(() => {
    loadVisitors()
    
    // Simulate some demo data if none exists
    const timer = setTimeout(() => {
      generateDemoData()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [generateDemoData, loadVisitors])

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.visitorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.deviceInfo.browser.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.deviceInfo.os.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDevice = deviceFilter === "all" || visitor.deviceInfo.device === deviceFilter
    return matchesSearch && matchesDevice
  })

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getDeviceIcon = (device: string) => {
    return device === 'mobile' ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />
  }

  const calculateEngagement = (visitor: VisitorProfile) => {
    const avgEventsPerSession = visitor.totalSessions > 0 ? visitor.totalEvents / visitor.totalSessions : 0
    if (avgEventsPerSession > 10) return { level: 'High', color: 'text-green-600 bg-green-100' }
    if (avgEventsPerSession > 5) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-100' }
    return { level: 'Low', color: 'text-red-600 bg-red-100' }
  }

  if (selectedVisitor) {
    return (
      <VisitorDetails 
        visitorId={selectedVisitor} 
        onBack={() => setSelectedVisitor(null)} 
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audience</h2>
          <p className="text-gray-600">Track and analyze your website visitors</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={loadVisitors} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={generateDemoData} variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Generate Demo Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Visitors</p>
                <p className="text-xl font-bold">{visitors.length}</p>
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
                <p className="text-xl font-bold">
                  {visitors.reduce((sum, v) => sum + v.totalEvents, 0)}
                </p>
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
                <p className="text-xl font-bold">
                  {visitors.reduce((sum, v) => sum + v.totalPageViews, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mobile Visitors</p>
                <p className="text-xl font-bold">
                  {visitors.filter(v => v.deviceInfo.device === 'mobile').length}
                </p>
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
                  placeholder="Search visitors by ID, browser, or OS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Visitors List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Visitors ({filteredVisitors.length})
          </CardTitle>
          <CardDescription>
            Individual visitor profiles with complete activity history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading visitors...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVisitors.map((visitor) => {
                const engagement = calculateEngagement(visitor)
                return (
                  <div 
                    key={visitor.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedVisitor(visitor.visitorId)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getDeviceIcon(visitor.deviceInfo.device)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {visitor.visitorId.slice(-8)}
                            </Badge>
                            <Badge className={`text-xs ${engagement.color}`}>
                              {engagement.level} Engagement
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {visitor.deviceInfo.browser} on {visitor.deviceInfo.os}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                          <Clock className="h-3 w-3" />
                          Last seen: {formatTimestamp(visitor.lastSeen)}
                        </div>
                        <p className="text-xs text-gray-500">
                          First visit: {formatTimestamp(visitor.firstSeen)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-600">Events:</span>
                        <span className="font-medium">{visitor.totalEvents}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-green-600" />
                        <span className="text-gray-600">Page Views:</span>
                        <span className="font-medium">{visitor.totalPageViews}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span className="text-gray-600">Sessions:</span>
                        <span className="font-medium">{visitor.totalSessions}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-orange-600" />
                        <span className="text-gray-600">Source:</span>
                        <span className="font-medium text-xs">
                          {visitor.acquisitionInfo.referrer ? 
                            new URL(visitor.acquisitionInfo.referrer).hostname : 
                            'Direct'
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        View Complete History →
                      </Button>
                    </div>
                  </div>
                )
              })}
              
              {filteredVisitors.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || deviceFilter !== "all" ? "No visitors found" : "No visitors yet"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || deviceFilter !== "all" 
                      ? "Try adjusting your filters or search terms"
                      : "Visitors will appear here once they start interacting with your website"
                    }
                  </p>
                  {!searchTerm && deviceFilter === "all" && (
                    <Button onClick={generateDemoData} variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Generate Demo Data
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}