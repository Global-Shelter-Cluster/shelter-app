// @flow

import {Analytics, PageHit, Event} from 'expo-analytics';
import config from "./config";

const trackingId = config.googleAnalyticsTrackingId;

const analytics = trackingId ? new Analytics(trackingId) : null;

export type EventDescription = {
  category: string,
  action: string,
  label?: string,
  value?: number,
}

export const hitPage = name => analytics.hit(new PageHit(name));
export const hitEvent = (e: EventDescription) => analytics.event(new Event(e.category, e.action, e.label, e.value));
