import type { OverlayValueKind } from './overlay-metric.types';

export const OVERLAY_VALUE = {
  format: {
    count: { maximumFractionDigits: 0 },
    rating: { maximumFractionDigits: 0 },
    percent: { minimumFractionDigits: 1, maximumFractionDigits: 1 }
  } satisfies Record<OverlayValueKind, Intl.NumberFormatOptions>,
  suffix: {
    count: '',
    rating: '',
    percent: '%'
  } satisfies Record<OverlayValueKind, string>,
  placeholder: '—'
} as const;
