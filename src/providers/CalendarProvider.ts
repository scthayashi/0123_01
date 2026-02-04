import { v4 as uuidv4 } from 'uuid';
import {
  CalendarEvent,
  DailySchedule,
  EventType,
  TransportMethod,
} from '../types';

export interface ICalendarProvider {
  getEventsForDate(date: Date): Promise<CalendarEvent[]>;
  getDailySchedule(date: Date): Promise<DailySchedule>;
  addEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent>;
}

export class CalendarProvider implements ICalendarProvider {
  private events: CalendarEvent[] = [];
  private defaultTransportMethod: TransportMethod = 'train';

  constructor(defaultTransportMethod?: TransportMethod) {
    if (defaultTransportMethod) {
      this.defaultTransportMethod = defaultTransportMethod;
    }
  }

  async getEventsForDate(date: Date): Promise<CalendarEvent[]> {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    return this.events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= dateStart && eventDate <= dateEnd;
    });
  }

  async getDailySchedule(date: Date): Promise<DailySchedule> {
    const events = await this.getEventsForDate(date);
    const primaryEventType = this.determinePrimaryEventType(events);
    const transportMethods = this.extractTransportMethods(events);

    return {
      date,
      events,
      primaryEventType,
      transportMethods: transportMethods.length > 0
        ? transportMethods
        : [this.defaultTransportMethod],
    };
  }

  async addEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const newEvent: CalendarEvent = {
      ...event,
      id: uuidv4(),
    };
    this.events.push(newEvent);
    return newEvent;
  }

  removeEvent(eventId: string): boolean {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      this.events.splice(index, 1);
      return true;
    }
    return false;
  }

  updateEvent(eventId: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      Object.assign(event, updates);
      return event;
    }
    return null;
  }

  private determinePrimaryEventType(events: CalendarEvent[]): EventType {
    if (events.length === 0) {
      return 'other';
    }

    // Priority order for determining primary event type
    const priorityOrder: EventType[] = [
      'interview',
      'presentation',
      'business_meeting',
      'client_visit',
      'dinner',
      'internal_meeting',
      'casual_meeting',
      'remote_work',
      'day_off',
      'other',
    ];

    // Find highest priority event
    for (const eventType of priorityOrder) {
      const found = events.find(e => e.eventType === eventType);
      if (found) {
        return eventType;
      }
    }

    // Also consider importance level
    const highImportanceEvent = events.find(e => e.importance === 'high');
    if (highImportanceEvent) {
      return highImportanceEvent.eventType;
    }

    return events[0].eventType;
  }

  private extractTransportMethods(events: CalendarEvent[]): TransportMethod[] {
    const methods: Set<TransportMethod> = new Set();

    for (const event of events) {
      // Infer transport method from location if available
      const method = this.inferTransportFromLocation(event.location);
      if (method) {
        methods.add(method);
      }
    }

    return Array.from(methods);
  }

  private inferTransportFromLocation(location?: string): TransportMethod | null {
    if (!location) return null;

    const locationLower = location.toLowerCase();

    // Simple heuristics - in real implementation, use maps API
    if (locationLower.includes('駅') || locationLower.includes('station')) {
      return 'train';
    }
    if (locationLower.includes('徒歩') || locationLower.includes('walk')) {
      return 'walk';
    }
    if (locationLower.includes('車') || locationLower.includes('parking')) {
      return 'car';
    }

    return null;
  }

  setDefaultTransportMethod(method: TransportMethod): void {
    this.defaultTransportMethod = method;
  }

  // Import events from external calendar (placeholder for integration)
  async importFromExternalCalendar(source: string): Promise<CalendarEvent[]> {
    // In real implementation, this would connect to:
    // - Google Calendar API
    // - Outlook Calendar API
    // - Apple Calendar
    // etc.
    console.log(`Importing from ${source}...`);
    return [];
  }

  getAllEvents(): CalendarEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}

// Event type utility functions
export function getEventFormality(eventType: EventType): { min: number; max: number } {
  switch (eventType) {
    case 'interview':
    case 'presentation':
    case 'client_visit':
      return { min: 4, max: 5 };
    case 'business_meeting':
      return { min: 3, max: 5 };
    case 'dinner':
      return { min: 3, max: 4 };
    case 'internal_meeting':
      return { min: 2, max: 4 };
    case 'casual_meeting':
      return { min: 2, max: 3 };
    case 'remote_work':
      return { min: 1, max: 3 };
    case 'day_off':
      return { min: 1, max: 2 };
    default:
      return { min: 2, max: 4 };
  }
}

export function isBusinessEvent(eventType: EventType): boolean {
  return [
    'business_meeting',
    'interview',
    'presentation',
    'client_visit',
    'internal_meeting',
  ].includes(eventType);
}

export function requiresExtraFormality(eventType: EventType): boolean {
  return ['interview', 'presentation', 'client_visit'].includes(eventType);
}
