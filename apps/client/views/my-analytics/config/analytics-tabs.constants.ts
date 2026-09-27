import type { PlusFeature } from '@otmetki/schemas';

export const ANALYTICS_TABS = [
  { value: 'today', feature: null, hasPeriod: false },
  { value: 'overview', feature: 'analytics', hasPeriod: true },
  { value: 'maps', feature: 'mapAdvisor', hasPeriod: true },
  { value: 'platoon', feature: 'mapAdvisor', hasPeriod: true },
  { value: 'rng', feature: 'battleAnalysis', hasPeriod: true }
] as const satisfies readonly { value: string; feature: PlusFeature | null; hasPeriod: boolean }[];

export const ANALYTICS_TAB_PARAM = 'tab';

export type AnalyticsTab = (typeof ANALYTICS_TABS)[number]['value'];
