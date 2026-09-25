import type { OverlayMetric } from '@bronevik/schemas';

import type { OverlayData } from '@/shared/api/streamers';
import type { RatingTone } from '@/shared/lib';

export type OverlayResult = NonNullable<NonNullable<OverlayData['session']>['lastBattle']>['result'];

export type OverlayValueKind = 'count' | 'percent' | 'rating';

export type OverlayMetricReading = {
  metric: OverlayMetric;
  value: number | null;
  kind: OverlayValueKind;
  tone: RatingTone | null;
  result: OverlayResult | null;
};

export type ReadOverlayMetricInput = {
  data: OverlayData;
  metric: OverlayMetric;
};

export type FormatOverlayValueInput = {
  value: number | null;
  kind: OverlayValueKind;
  locale: string;
};
