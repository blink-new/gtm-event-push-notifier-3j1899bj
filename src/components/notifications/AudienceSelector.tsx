import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Globe, Filter, Users, Search, MapPin, Clock, Activity } from 'lucide-react'
import { visitorTrackingService, VisitorProfile } from '@/services/visitorTracking'

interface AudienceSelectorProps {
  audienceType: 'all_visitors' | 'segment' | 'custom'
  onAudienceTypeChange: (type: 'all_visitors' | 'segment' | 'custom') => void
  selectedVisitorIds: string[]
  onSelectedVisitorsChange: (ids: string[]) => void
  audienceCriteria: any
  onAudienceCriteriaChange: (criteria: any) => void
}

export function AudienceSelector({
  audienceType,
  onAudienceTypeChange,
  selectedVisitorIds,
  onSelectedVisitorsChange,
  audienceCriteria,
  onAudienceCriteriaChange
}: AudienceSelectorProps) {
  const [visitors, setVisitors] = useState<VisitorProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [segmentCriteria, setSegmentCriteria] = useState({
    deviceType: '',
    browser: '',
    country: '',
    minSessions: '',
    minPageViews: '',
    lastSeenDays: ''
  })

  const loadVisitors = async () => {
    try {
      setLoading(true)
      const profiles = await visitorTrackingService.getVisitorProfiles(100)
      setVisitors(profiles)
    } catch (error) {
      console.error('Failed to load visitors:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredVisitors = () => {
    return visitors.filter(visitor => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          visitor.visitorId.toLowerCase().includes(searchLower) ||
          visitor.deviceInfo.browser.toLowerCase().includes(searchLower) ||
          visitor.deviceInfo.device.toLowerCase().includes(searchLower) ||
          visitor.locationInfo.country?.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }

  useEffect(() => {
    loadVisitors()
  }, [])

  const handleVisitorToggle = (visitorId: string, checked: boolean) => {
    if (checked) {
      onSelectedVisitorsChange([...selectedVisitorIds, visitorId])
    } else {
      onSelectedVisitorsChange(selectedVisitorIds.filter(id => id !== visitorId))
    }
  }

  const handleSelectAll = () => {
    const filteredVisitors = getFilteredVisitors()
    const allIds = filteredVisitors.map(v => v.visitorId)
    onSelectedVisitorsChange(allIds)
  }

  const handleDeselectAll = () => {
    onSelectedVisitorsChange([])
  }

  const handleSegmentCriteriaChange = (field: string, value: string) => {
    const newCriteria = { ...segmentCriteria, [field]: value }
    setSegmentCriteria(newCriteria)
    onAudienceCriteriaChange(newCriteria)
  }

  const getSegmentCount = () => {
    return visitors.filter(visitor => {
      if (segmentCriteria.deviceType && visitor.deviceInfo.device !== segmentCriteria.deviceType) return false
      if (segmentCriteria.browser && visitor.deviceInfo.browser !== segmentCriteria.browser) return false
      if (segmentCriteria.country && visitor.locationInfo.country !== segmentCriteria.country) return false
      if (segmentCriteria.minSessions && visitor.totalSessions < parseInt(segmentCriteria.minSessions)) return false
      if (segmentCriteria.minPageViews && visitor.totalPageViews < parseInt(segmentCriteria.minPageViews)) return false
      if (segmentCriteria.lastSeenDays) {
        const daysSinceLastSeen = Math.floor((Date.now() - new Date(visitor.lastSeen).getTime()) / (1000 * 60 * 60 * 24))
        if (daysSinceLastSeen > parseInt(segmentCriteria.lastSeenDays)) return false
      }
      return true
    }).length
  }

  const filteredVisitors = getFilteredVisitors()

  return (
    <div className="space-y-6">
      {/* Audience Type Selection */}
      <div>
        <Label className="text-base font-medium">Choose your audience</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <Card 
            className={`cursor-pointer transition-all ${
              audienceType === 'all_visitors' 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onAudienceTypeChange('all_visitors')}
          >
            <CardContent className="p-4 text-center">
              <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">All Visitors</h3>
              <p className="text-sm text-gray-600 mt-1">
                Send to everyone who has visited your site
              </p>
              <Badge variant="outline" className="mt-2">
                {visitors.length} visitors
              </Badge>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              audienceType === 'segment' 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onAudienceTypeChange('segment')}
          >
            <CardContent className="p-4 text-center">
              <Filter className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Segment</h3>
              <p className="text-sm text-gray-600 mt-1">
                Target visitors based on specific criteria
              </p>
              <Badge variant="outline" className="mt-2">
                {getSegmentCount()} visitors
              </Badge>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              audienceType === 'custom' 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onAudienceTypeChange('custom')}
          >
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Custom Selection</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manually select specific visitors
              </p>
              <Badge variant="outline" className="mt-2">
                {selectedVisitorIds.length} selected
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Segment Configuration */}
      {audienceType === 'segment' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Segment Criteria
            </CardTitle>
            <CardDescription>
              Define the criteria to target specific visitor groups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="deviceType">Device Type</Label>
                <Select onValueChange={(value) => handleSegmentCriteriaChange('deviceType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any device</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="browser">Browser</Label>
                <Select onValueChange={(value) => handleSegmentCriteriaChange('browser', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any browser" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any browser</SelectItem>
                    <SelectItem value="Chrome">Chrome</SelectItem>
                    <SelectItem value="Firefox">Firefox</SelectItem>
                    <SelectItem value="Safari">Safari</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Select onValueChange={(value) => handleSegmentCriteriaChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any country</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="minSessions">Min Sessions</Label>
                <Input
                  id="minSessions"
                  type="number"
                  placeholder="e.g., 2"
                  value={segmentCriteria.minSessions}
                  onChange={(e) => handleSegmentCriteriaChange('minSessions', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="minPageViews">Min Page Views</Label>
                <Input
                  id="minPageViews"
                  type="number"
                  placeholder="e.g., 5"
                  value={segmentCriteria.minPageViews}
                  onChange={(e) => handleSegmentCriteriaChange('minPageViews', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="lastSeenDays">Last Seen (days)</Label>
                <Input
                  id="lastSeenDays"
                  type="number"
                  placeholder="e.g., 7"
                  value={segmentCriteria.lastSeenDays}
                  onChange={(e) => handleSegmentCriteriaChange('lastSeenDays', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Users className="h-4 w-4" />
                <span className="font-medium">Segment Preview</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                This segment will target <strong>{getSegmentCount()} visitors</strong> based on your criteria
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Selection */}
      {audienceType === 'custom' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Visitors
            </CardTitle>
            <CardDescription>
              Choose specific visitors to receive this notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Deselect All
              </Button>
            </div>

            {/* Selected Count */}
            {selectedVisitorIds.length > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-primary font-medium text-sm">
                  {selectedVisitorIds.length} visitor{selectedVisitorIds.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {/* Visitors List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading visitors...</p>
                </div>
              ) : filteredVisitors.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No visitors found</p>
                </div>
              ) : (
                filteredVisitors.map((visitor) => (
                  <div
                    key={visitor.visitorId}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={selectedVisitorIds.includes(visitor.visitorId)}
                      onCheckedChange={(checked) => 
                        handleVisitorToggle(visitor.visitorId, checked as boolean)
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Visitor {visitor.visitorId.split('_')[1]?.slice(0, 8)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {visitor.deviceInfo.device}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {visitor.deviceInfo.browser}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {visitor.totalSessions} sessions
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last seen {new Date(visitor.lastSeen).toLocaleDateString()}
                        </div>
                        {visitor.locationInfo.country && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {visitor.locationInfo.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}