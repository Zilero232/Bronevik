import type { FormatNumberInput } from './stat-format.types';

export const formatNumber = ({ value, locale, digits = 0 }: FormatNumberInput): string | null =>
  value === null || !Number.isFinite(value)
    ? null
    : new Intl.NumberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);

export const formatPercent = ({ value, locale }: Omit<FormatNumberInput, 'digits'>): string | null =>
  value === null || !Number.isFinite(value)
    ? null
    : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value);
