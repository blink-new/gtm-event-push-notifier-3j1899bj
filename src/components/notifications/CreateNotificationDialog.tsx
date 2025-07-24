import { useState, useEffect } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, Users, Zap, Globe, Filter, Target } from 'lucide-react'
import { AudienceSelector } from './AudienceSelector'
import { NotificationPreview } from './NotificationPreview'

interface CreateNotificationDialogProps {
  onSubmit: (data: any) => void
}

export function CreateNotificationDialog({ onSubmit }: CreateNotificationDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    message: '',
    iconUrl: '',
    actionUrl: '',
    audienceType: 'all_visitors' as 'all_visitors' | 'segment' | 'custom',
    audienceCriteria: null,
    selectedVisitorIds: [] as string[],
    triggerType: 'immediate' as 'immediate' | 'scheduled' | 'event_based',
    triggerConfig: null,
    scheduledAt: ''
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      status: 'draft',
      audienceCriteria: formData.audienceCriteria ? JSON.stringify(formData.audienceCriteria) : null,
      selectedVisitorIds: JSON.stringify(formData.selectedVisitorIds),
      triggerConfig: formData.triggerConfig ? JSON.stringify(formData.triggerConfig) : null
    })
  }

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.name && formData.title && formData.message
      case 2:
        return formData.audienceType === 'all_visitors' || 
               (formData.audienceType === 'custom' && formData.selectedVisitorIds.length > 0) ||
               (formData.audienceType === 'segment' && formData.audienceCriteria)
      case 3:
        return formData.triggerType === 'immediate' || 
               (formData.triggerType === 'scheduled' && formData.scheduledAt) ||
               (formData.triggerType === 'event_based' && formData.triggerConfig)
      default:
        return true
    }
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Notification</DialogTitle>
        <DialogDescription>
          Set up a web push notification campaign for your visitors
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNumber 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`
                  w-12 h-0.5 mx-2
                  ${step > stepNumber ? 'bg-primary' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="font-medium text-gray-900">
            {step === 1 && 'Message Content'}
            {step === 2 && 'Select Audience'}
            {step === 3 && 'Delivery Settings'}
            {step === 4 && 'Review & Launch'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {step === 1 && 'Create your notification message'}
            {step === 2 && 'Choose who will receive this notification'}
            {step === 3 && 'Configure when to send the notification'}
            {step === 4 && 'Review your notification before sending'}
          </p>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Welcome New Users"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="title">Notification Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Welcome to our platform!"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="e.g., Thanks for joining us. Explore our features to get started."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="iconUrl">Icon URL (optional)</Label>
                  <Input
                    id="iconUrl"
                    placeholder="https://example.com/icon.png"
                    value={formData.iconUrl}
                    onChange={(e) => handleInputChange('iconUrl', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="actionUrl">Action URL (optional)</Label>
                  <Input
                    id="actionUrl"
                    placeholder="https://example.com/welcome"
                    value={formData.actionUrl}
                    onChange={(e) => handleInputChange('actionUrl', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <NotificationPreview
                  title={formData.title || 'Notification Title'}
                  message={formData.message || 'Your notification message will appear here'}
                  iconUrl={formData.iconUrl}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <AudienceSelector
              audienceType={formData.audienceType}
              onAudienceTypeChange={(type) => handleInputChange('audienceType', type)}
              selectedVisitorIds={formData.selectedVisitorIds}
              onSelectedVisitorsChange={(ids) => handleInputChange('selectedVisitorIds', ids)}
              audienceCriteria={formData.audienceCriteria}
              onAudienceCriteriaChange={(criteria) => handleInputChange('audienceCriteria', criteria)}
            />
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label>When should this notification be sent?</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <Card 
                    className={`cursor-pointer transition-all ${
                      formData.triggerType === 'immediate' 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleInputChange('triggerType', 'immediate')}
                  >
                    <CardContent className="p-4 text-center">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Send Immediately</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Send to all selected visitors right away
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all ${
                      formData.triggerType === 'scheduled' 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleInputChange('triggerType', 'scheduled')}
                  >
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Schedule</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Send at a specific date and time
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all ${
                      formData.triggerType === 'event_based' 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleInputChange('triggerType', 'event_based')}
                  >
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Event-Based</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Trigger based on user actions
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {formData.triggerType === 'scheduled' && (
                <div>
                  <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}

              {formData.triggerType === 'event_based' && (
                <div className="space-y-4">
                  <Label>Trigger Event</Label>
                  <Select onValueChange={(value) => handleInputChange('triggerConfig', { event: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page_view">Page View</SelectItem>
                      <SelectItem value="button_click">Button Click</SelectItem>
                      <SelectItem value="form_submit">Form Submit</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="cart_abandon">Cart Abandon</SelectItem>
                      <SelectItem value="session_end">Session End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Notification Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationPreview
                    title={formData.title}
                    message={formData.message}
                    iconUrl={formData.iconUrl}
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Audience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <Badge variant="outline">
                          {formData.audienceType === 'all_visitors' ? 'All Visitors' :
                           formData.audienceType === 'segment' ? 'Segment' : 'Custom Selection'}
                        </Badge>
                      </div>
                      {formData.audienceType === 'custom' && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Selected:</span>
                          <span className="text-sm font-medium">{formData.selectedVisitorIds.length} visitors</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Delivery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <Badge variant="outline">
                          {formData.triggerType === 'immediate' ? 'Immediate' :
                           formData.triggerType === 'scheduled' ? 'Scheduled' : 'Event-Based'}
                        </Badge>
                      </div>
                      {formData.triggerType === 'scheduled' && formData.scheduledAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">When:</span>
                          <span className="text-sm font-medium">
                            {new Date(formData.scheduledAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid(step)}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isStepValid(step)}>
                Create Notification
              </Button>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}