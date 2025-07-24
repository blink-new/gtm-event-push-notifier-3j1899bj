import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Copy, 
  CheckCircle, 
  ExternalLink, 
  Code, 
  Settings, 
  Zap,
  AlertCircle,
  Play,
  FileText,
  Globe,
  X
} from 'lucide-react'

interface GTMIntegrationGuideProps {
  onClose: () => void
}

export function GTMIntegrationGuide({ onClose }: GTMIntegrationGuideProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(1)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const gtmCode = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->`

  const gtmNoScript = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`

  const customEventCode = `// Send custom event to GTM
dataLayer.push({
  'event': 'custom_event',
  'event_category': 'engagement',
  'event_action': 'button_click',
  'event_label': 'header_cta',
  'custom_parameter': 'value'
});`

  const webhookCode = `// Your webhook endpoint URL
const webhookUrl = 'https://your-app.com/api/gtm-webhook';

// GTM Custom HTML Tag
fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    event: '{{Event}}',
    page_url: '{{Page URL}}',
    user_id: '{{User ID}}',
    timestamp: new Date().toISOString(),
    custom_data: {
      category: '{{Event Category}}',
      action: '{{Event Action}}',
      label: '{{Event Label}}'
    }
  })
});`

  const steps = [
    {
      id: 1,
      title: "Create GTM Container",
      description: "Set up your Google Tag Manager container",
      completed: false
    },
    {
      id: 2,
      title: "Install GTM Code",
      description: "Add GTM tracking code to your website",
      completed: false
    },
    {
      id: 3,
      title: "Configure Events",
      description: "Set up custom events and triggers",
      completed: false
    },
    {
      id: 4,
      title: "Setup Webhook",
      description: "Connect GTM to our notification system",
      completed: false
    },
    {
      id: 5,
      title: "Test Integration",
      description: "Verify events are being tracked",
      completed: false
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">GTM Integration Guide</h2>
              <p className="text-sm text-gray-600">Connect Google Tag Manager to track events and send notifications</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar - Steps */}
          <div className="w-80 border-r bg-gray-50 p-6 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Integration Steps</h3>
            <div className="space-y-3">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    activeStep === step.id 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : activeStep === step.id 
                          ? 'bg-white text-primary' 
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${
                        activeStep === step.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </p>
                      <p className={`text-xs ${
                        activeStep === step.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 text-sm">Need Help?</p>
                  <p className="text-blue-700 text-xs mt-1">
                    Check our documentation or contact support if you get stuck.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 text-blue-600 border-blue-200">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Docs
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Create GTM Container</h3>
                  <p className="text-gray-600 mb-4">
                    First, you'll need to create a Google Tag Manager container for your website.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Create New Container
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium mt-0.5">1</div>
                        <div>
                          <p className="font-medium">Go to Google Tag Manager</p>
                          <p className="text-sm text-gray-600">Visit tagmanager.google.com and sign in with your Google account</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open GTM
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium mt-0.5">2</div>
                        <div>
                          <p className="font-medium">Create Account & Container</p>
                          <p className="text-sm text-gray-600">Click "Create Account" and fill in your account and container details</p>
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm"><strong>Account Name:</strong> Your Company Name</p>
                            <p className="text-sm"><strong>Container Name:</strong> Your Website Name</p>
                            <p className="text-sm"><strong>Target Platform:</strong> Web</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium mt-0.5">3</div>
                        <div>
                          <p className="font-medium">Copy Container ID</p>
                          <p className="text-sm text-gray-600">After creation, copy your GTM container ID (format: GTM-XXXXXXX)</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Keep your GTM container ID handy - you'll need it for the next step.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Install GTM Code</h3>
                  <p className="text-gray-600 mb-4">
                    Add the Google Tag Manager tracking code to your website's HTML.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Head Section Code
                    </CardTitle>
                    <CardDescription>
                      Add this code to the &lt;head&gt; section of every page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{gtmCode}</code>
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(gtmCode, 'head')}
                      >
                        {copiedCode === 'head' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Body Section Code
                    </CardTitle>
                    <CardDescription>
                      Add this code immediately after the opening &lt;body&gt; tag
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{gtmNoScript}</code>
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(gtmNoScript, 'body')}
                      >
                        {copiedCode === 'body' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Remember:</strong> Replace "GTM-XXXXXXX" with your actual container ID from Step 1.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: Configure Events</h3>
                  <p className="text-gray-600 mb-4">
                    Set up custom events and triggers to track user interactions on your website.
                  </p>
                </div>

                <Tabs defaultValue="events" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="events">Custom Events</TabsTrigger>
                    <TabsTrigger value="triggers">Triggers</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="events" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Send Custom Events</CardTitle>
                        <CardDescription>
                          Use this JavaScript code to send custom events to GTM
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                            <code>{customEventCode}</code>
                          </pre>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(customEventCode, 'event')}
                          >
                            {copiedCode === 'event' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Common Event Examples</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 border rounded-lg">
                            <h4 className="font-medium text-sm">Purchase Completed</h4>
                            <p className="text-xs text-gray-600 mt-1">Track successful purchases</p>
                            <Badge variant="outline" className="mt-2">E-commerce</Badge>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <h4 className="font-medium text-sm">Form Submission</h4>
                            <p className="text-xs text-gray-600 mt-1">Track form completions</p>
                            <Badge variant="outline" className="mt-2">Lead Generation</Badge>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <h4 className="font-medium text-sm">Video Play</h4>
                            <p className="text-xs text-gray-600 mt-1">Track video engagement</p>
                            <Badge variant="outline" className="mt-2">Engagement</Badge>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <h4 className="font-medium text-sm">Download</h4>
                            <p className="text-xs text-gray-600 mt-1">Track file downloads</p>
                            <Badge variant="outline" className="mt-2">Content</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="triggers" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Setting Up Triggers in GTM</CardTitle>
                        <CardDescription>
                          Configure when your tags should fire
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium mt-0.5">1</div>
                            <div>
                              <p className="font-medium">Go to Triggers in GTM</p>
                              <p className="text-sm text-gray-600">Navigate to Triggers section in your GTM workspace</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium mt-0.5">2</div>
                            <div>
                              <p className="font-medium">Create New Trigger</p>
                              <p className="text-sm text-gray-600">Click "New" and choose trigger type (Page View, Click, Custom Event, etc.)</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium mt-0.5">3</div>
                            <div>
                              <p className="font-medium">Configure Conditions</p>
                              <p className="text-sm text-gray-600">Set up when the trigger should fire (URL contains, element clicked, etc.)</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4: Setup Webhook</h3>
                  <p className="text-gray-600 mb-4">
                    Connect GTM to our notification system using webhooks to trigger push notifications.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Webhook Configuration
                    </CardTitle>
                    <CardDescription>
                      Create a Custom HTML tag in GTM to send events to our system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Your Webhook URL</h4>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-white rounded border text-sm">
                          https://gtm-event-push-notifier-3j1899bj.sites.blink.new/api/webhook
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard('https://gtm-event-push-notifier-3j1899bj.sites.blink.new/api/webhook', 'webhook-url')}
                        >
                          {copiedCode === 'webhook-url' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{webhookCode}</code>
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(webhookCode, 'webhook')}
                      >
                        {copiedCode === 'webhook' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Steps to Create Custom HTML Tag:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs mt-0.5">1</span>
                          <span>Go to Tags → New → Custom HTML</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs mt-0.5">2</span>
                          <span>Paste the webhook code above</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs mt-0.5">3</span>
                          <span>Set trigger to fire on your custom events</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs mt-0.5">4</span>
                          <span>Save and publish your container</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 5: Test Integration</h3>
                  <p className="text-gray-600 mb-4">
                    Verify that events are being tracked and notifications are working correctly.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Testing Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">GTM Preview Mode</p>
                          <p className="text-xs text-gray-600">Use GTM's preview mode to test tag firing</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Test
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">Event Monitor</p>
                          <p className="text-xs text-gray-600">Check our Event Monitor for incoming events</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Monitor
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">Test Notification</p>
                          <p className="text-xs text-gray-600">Send a test push notification</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <Bell className="h-4 w-4 mr-1" />
                          Send Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Troubleshooting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                        <p className="font-medium text-sm text-yellow-800">Events not appearing?</p>
                        <p className="text-xs text-yellow-700 mt-1">Check GTM preview mode and ensure triggers are configured correctly</p>
                      </div>
                      
                      <div className="p-3 border-l-4 border-red-400 bg-red-50">
                        <p className="font-medium text-sm text-red-800">Webhook errors?</p>
                        <p className="text-xs text-red-700 mt-1">Verify the webhook URL is correct and your site can make external requests</p>
                      </div>
                      
                      <div className="p-3 border-l-4 border-blue-400 bg-blue-50">
                        <p className="font-medium text-sm text-blue-800">Need help?</p>
                        <p className="text-xs text-blue-700 mt-1">Contact our support team or check the documentation</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button className="px-8">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Integration
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}