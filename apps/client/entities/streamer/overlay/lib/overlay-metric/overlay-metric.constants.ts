import type { OverlayValueKind } from './overlay-metric.types';

export const OVERLAY_VALUE_FORMAT: Record<OverlayValueKind, Intl.NumberFormatOptions> = {
  count: { maximumFractionDigits: 0 },
  rating: { maximumFractionDigits: 0 },
  percent: { minimumFractionDigits: 1, maximumFractionDigits: 1 }
};

export const OVERLAY_VALUE_SUFFIX: Record<OverlayValueKind, string> = {
  count: '',
  rating: '',
  percent: '%'
};

export const OVERLAY_PLACEHOLDER = '—';
