import { blink } from '@/blink/client'

export interface VisitorEvent {
  id: string
  visitorId: string
  sessionId: string
  eventName: string
  eventData: any
  pageUrl: string
  pageTitle?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
  timestamp: string
  createdAt: string
}

export interface VisitorProfile {
  id: string
  visitorId: string
  firstSeen: string
  lastSeen: string
  totalSessions: number
  totalPageViews: number
  totalEvents: number
  deviceInfo: {
    device: string
    browser: string
    os: string
    userAgent: string
  }
  locationInfo: {
    country?: string
    city?: string
    ipAddress?: string
  }
  acquisitionInfo: {
    referrer?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  }
  createdAt: string
  updatedAt: string
}

export interface VisitorSession {
  sessionId: string
  visitorId: string
  startedAt: string
  endedAt?: string
  durationSeconds: number
  pageViews: number
  eventsCount: number
  entryPage?: string
  exitPage?: string
  referrer?: string
}

class VisitorTrackingService {
  private currentVisitorId: string | null = null
  private currentSessionId: string | null = null
  private sessionStartTime: number = Date.now()

  constructor() {
    this.initializeVisitor()
  }

  private initializeVisitor() {
    // Get or create visitor ID (persistent across sessions)
    this.currentVisitorId = localStorage.getItem('gtm_visitor_id')
    if (!this.currentVisitorId) {
      this.currentVisitorId = this.generateId('visitor')
      localStorage.setItem('gtm_visitor_id', this.currentVisitorId)
    }

    // Create new session ID for each page load
    this.currentSessionId = this.generateId('session')
    this.sessionStartTime = Date.now()
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private parseUserAgent(userAgent: string) {
    // Simple user agent parsing - in production, use a proper library
    const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop'
    const browser = userAgent.includes('Chrome') ? 'Chrome' : 
                   userAgent.includes('Firefox') ? 'Firefox' : 
                   userAgent.includes('Safari') ? 'Safari' : 'Unknown'
    const os = userAgent.includes('Windows') ? 'Windows' :
               userAgent.includes('Mac') ? 'macOS' :
               userAgent.includes('Linux') ? 'Linux' :
               userAgent.includes('Android') ? 'Android' :
               userAgent.includes('iOS') ? 'iOS' : 'Unknown'
    
    return { device, browser, os }
  }

  async trackEvent(eventName: string, eventData: any = {}, pageUrl?: string, pageTitle?: string) {
    if (!this.currentVisitorId || !this.currentSessionId) {
      this.initializeVisitor()
    }

    const event: VisitorEvent = {
      id: this.generateId('event'),
      visitorId: this.currentVisitorId!,
      sessionId: this.currentSessionId!,
      eventName,
      eventData,
      pageUrl: pageUrl || window.location.href,
      pageTitle: pageTitle || document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    try {
      // Store in database (when available)
      // await blink.db.gtmEvents.create({
      //   id: event.id,
      //   userId: (await blink.auth.me()).id,
      //   visitorId: event.visitorId,
      //   sessionId: event.sessionId,
      //   eventName: event.eventName,
      //   eventData: JSON.stringify(event.eventData),
      //   pageUrl: event.pageUrl,
      //   pageTitle: event.pageTitle,
      //   referrer: event.referrer,
      //   userAgent: event.userAgent,
      //   timestamp: event.timestamp,
      //   createdAt: event.createdAt
      // })

      // For now, store in localStorage for demo
      const events = this.getStoredEvents()
      events.push(event)
      localStorage.setItem('gtm_events', JSON.stringify(events.slice(-1000))) // Keep last 1000 events

      // Update visitor profile
      await this.updateVisitorProfile(event)

      return event
    } catch (error) {
      console.error('Failed to track event:', error)
      throw error
    }
  }

  private getStoredEvents(): VisitorEvent[] {
    try {
      const stored = localStorage.getItem('gtm_events')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private getStoredProfiles(): VisitorProfile[] {
    try {
      const stored = localStorage.getItem('gtm_visitor_profiles')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private async updateVisitorProfile(event: VisitorEvent) {
    const profiles = this.getStoredProfiles()
    let profile = profiles.find(p => p.visitorId === event.visitorId)

    const deviceInfo = this.parseUserAgent(event.userAgent || '')
    
    if (!profile) {
      // Create new profile
      profile = {
        id: this.generateId('profile'),
        visitorId: event.visitorId,
        firstSeen: event.timestamp,
        lastSeen: event.timestamp,
        totalSessions: 1,
        totalPageViews: event.eventName === 'page_view' ? 1 : 0,
        totalEvents: 1,
        deviceInfo: {
          ...deviceInfo,
          userAgent: event.userAgent || ''
        },
        locationInfo: {
          ipAddress: event.ipAddress
        },
        acquisitionInfo: {
          referrer: event.referrer
        },
        createdAt: event.timestamp,
        updatedAt: event.timestamp
      }
      profiles.push(profile)
    } else {
      // Update existing profile
      profile.lastSeen = event.timestamp
      profile.totalEvents += 1
      if (event.eventName === 'page_view') {
        profile.totalPageViews += 1
      }
      profile.updatedAt = event.timestamp
    }

    localStorage.setItem('gtm_visitor_profiles', JSON.stringify(profiles))
  }

  async getVisitorEvents(visitorId?: string, limit: number = 100): Promise<VisitorEvent[]> {
    try {
      // In production, this would query the database
      // const events = await blink.db.gtmEvents.list({
      //   where: visitorId ? { visitorId } : {},
      //   orderBy: { timestamp: 'desc' },
      //   limit
      // })

      // For now, get from localStorage
      const events = this.getStoredEvents()
      const filtered = visitorId ? events.filter(e => e.visitorId === visitorId) : events
      return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit)
    } catch (error) {
      console.error('Failed to get visitor events:', error)
      return []
    }
  }

  async getVisitorProfiles(limit: number = 50): Promise<VisitorProfile[]> {
    try {
      // In production, this would query the database
      // const profiles = await blink.db.visitorProfiles.list({
      //   orderBy: { lastSeen: 'desc' },
      //   limit
      // })

      // For now, get from localStorage
      const profiles = this.getStoredProfiles()
      return profiles.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()).slice(0, limit)
    } catch (error) {
      console.error('Failed to get visitor profiles:', error)
      return []
    }
  }

  async getVisitorProfile(visitorId: string): Promise<VisitorProfile | null> {
    try {
      const profiles = this.getStoredProfiles()
      return profiles.find(p => p.visitorId === visitorId) || null
    } catch (error) {
      console.error('Failed to get visitor profile:', error)
      return null
    }
  }

  async getVisitorSessions(visitorId: string): Promise<VisitorSession[]> {
    try {
      const events = await this.getVisitorEvents(visitorId)
      const sessionMap = new Map<string, VisitorSession>()

      events.forEach(event => {
        if (!sessionMap.has(event.sessionId)) {
          sessionMap.set(event.sessionId, {
            sessionId: event.sessionId,
            visitorId: event.visitorId,
            startedAt: event.timestamp,
            endedAt: event.timestamp,
            durationSeconds: 0,
            pageViews: 0,
            eventsCount: 0,
            entryPage: event.pageUrl,
            exitPage: event.pageUrl,
            referrer: event.referrer
          })
        }

        const session = sessionMap.get(event.sessionId)!
        session.eventsCount += 1
        if (event.eventName === 'page_view') {
          session.pageViews += 1
        }

        // Update session timing
        const eventTime = new Date(event.timestamp).getTime()
        const startTime = new Date(session.startedAt).getTime()
        const endTime = new Date(session.endedAt!).getTime()

        if (eventTime < startTime) {
          session.startedAt = event.timestamp
          session.entryPage = event.pageUrl
        }
        if (eventTime > endTime) {
          session.endedAt = event.timestamp
          session.exitPage = event.pageUrl
        }

        session.durationSeconds = Math.floor((new Date(session.endedAt!).getTime() - new Date(session.startedAt).getTime()) / 1000)
      })

      return Array.from(sessionMap.values()).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    } catch (error) {
      console.error('Failed to get visitor sessions:', error)
      return []
    }
  }

  getCurrentVisitorId(): string | null {
    return this.currentVisitorId
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId
  }

  // Simulate GTM events for demo
  async simulateGTMEvent(eventName: string, eventData: any = {}) {
    return this.trackEvent(eventName, eventData)
  }
}

export const visitorTrackingService = new VisitorTrackingService()