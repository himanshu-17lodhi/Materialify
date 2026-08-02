import { Event } from '@/events/emitter';

export type AllIconsLoadedEvent = Event<undefined>;

export type EventMap = {
  allIconsLoaded: AllIconsLoadedEvent;
};

export type EventType = keyof EventMap;
export type AnyEvent = EventMap[EventType];
