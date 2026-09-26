import type { CHART_GRANULARITIES, CHART_METRICS } from './charts.constants';
import type { PROFILE_TABS } from './profile.constants';

export type ProfileTab = (typeof PROFILE_TABS)[number];

export type ChartMetric = (typeof CHART_METRICS)[number];

export type ChartGranularity = (typeof CHART_GRANULARITIES)[number];
