// @flow

import {Analytics, PageHit, Event} from 'expo-analytics';
import config from "./config";

const trackingId = config.googleAnalyticsTrackingId;

const analytics = trackingId ? new Analytics(trackingId) : null;

export const hitPage = name => analytics.hit(new PageHit(name));
