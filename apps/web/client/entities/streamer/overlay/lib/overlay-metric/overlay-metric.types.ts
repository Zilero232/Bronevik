import type { OverlayData, OverlayMetric } from '@otmetki/schemas';

import type { RatingTone } from '@/shared/lib';

type OverlayResult = NonNullable<NonNullable<OverlayData['session']>['lastBattle']>['result'];

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

export type OverlayToneInput = {
  scale: 'winRate' | 'wn8';
  value: number | null;
};
