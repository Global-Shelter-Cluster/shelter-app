// @flow

import {Analytics} from 'expo-analytics';
import config from "./config";

const trackingId = config.googleAnalyticsTrackingId;

const analytics = trackingId ? new Analytics(trackingId) : null;

export default analytics;
