import type { CHART_GRANULARITIES, CHART_METRICS } from '../config/charts.constants';
import type { PROFILE_TABS } from '../config/profile.constants';

export type ProfileTab = (typeof PROFILE_TABS)[number];

export type ChartMetric = (typeof CHART_METRICS)[number];

export type ChartGranularity = (typeof CHART_GRANULARITIES)[number];
