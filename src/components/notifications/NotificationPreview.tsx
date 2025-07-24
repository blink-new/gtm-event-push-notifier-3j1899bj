import { Bell, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NotificationPreviewProps {
  title: string
  message: string
  iconUrl?: string
}

export function NotificationPreview({ title, message, iconUrl }: NotificationPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4" />
          Notification Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Browser Notification Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Browser Notification</p>
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {iconUrl ? (
                    <img 
                      src={iconUrl} 
                      alt="Notification icon" 
                      className="w-8 h-8 rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-8 h-8 bg-primary rounded flex items-center justify-center ${iconUrl ? 'hidden' : ''}`}>
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {title}
                    </p>
                    <span className="text-xs text-gray-500">now</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      {window.location.hostname}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Notification Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Mobile Notification</p>
            <div className="bg-gray-900 text-white rounded-lg p-3 max-w-xs">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {iconUrl ? (
                    <img 
                      src={iconUrl} 
                      alt="Notification icon" 
                      className="w-6 h-6 rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-6 h-6 bg-primary rounded flex items-center justify-center ${iconUrl ? 'hidden' : ''}`}>
                    <Bell className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {title}
                    </p>
                    <span className="text-xs text-gray-400">now</span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-xs">
              <strong>Note:</strong> The actual appearance may vary depending on the user's browser and operating system.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}