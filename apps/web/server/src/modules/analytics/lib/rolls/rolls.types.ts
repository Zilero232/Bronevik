import type { AnalyticsRng } from '@otmetki/schemas';

export type RollSummary = Pick<AnalyticsRng, 'buckets' | 'distance' | 'meanRoll' | 'shots' | 'withinSpread'>;
