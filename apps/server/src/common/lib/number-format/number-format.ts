import type { FormatNumberInput, FormatOrInput, FormatPercentInput } from './number-format.types';

const isFiniteNumber = (value: number | null | undefined): value is number => value !== null && value !== undefined && Number.isFinite(value);

export const formatNumber = ({ value, locale, digits = 0, grouping = true }: FormatNumberInput): string | null =>
  isFiniteNumber(value)
    ? new Intl.NumberFormat(locale, {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
        useGrouping: grouping
      }).format(value)
    : null;

export const formatPercent = ({ value, locale, digits = 2 }: FormatPercentInput): string | null =>
  isFiniteNumber(value)
    ? new Intl.NumberFormat(locale, {
        style: 'percent',
        maximumFractionDigits: digits,
        minimumFractionDigits: digits
      }).format(value)
    : null;

export const formatNumberOr = ({ missing, ...input }: FormatOrInput<FormatNumberInput>): string => formatNumber(input) ?? missing;

export const formatPercentOr = ({ missing, ...input }: FormatOrInput<FormatPercentInput>): string => formatPercent(input) ?? missing;
