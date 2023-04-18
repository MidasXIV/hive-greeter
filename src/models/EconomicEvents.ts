// import any required dependencies and interfaces
import { request } from "undici";

export interface EconomicEvent {
  day: string;
  events: {
    release: string;
    time: string;
    actual: string;
    expected: string;
    prior: string;
    impact?: string;
  }[]
}

export class EconomicEventsModel {
  private readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async fetchEvents(): Promise<EconomicEvent[]> {
    const response = await request(this.endpoint);
    const { events } = await response.body.json();

    // transform the data as required
    const transformedEvents = events.map((day: any) => {
      const eventsForDay = day.events;
      const transformedEventsForDay = eventsForDay.map((event: any) => {
        return {
          release: event.release,
          time: event.time,
          actual: event.actual,
          expected: event.expected,
          prior: event.prior,
          impact: event.impact,
        };
      });
      return { day: day.day, events: transformedEventsForDay };
    });

    return transformedEvents;
  }
}
