import { fromUnixTime } from 'date-fns';
import { clamp } from 'remeda';

import type { RatioInput } from './serialize.types';

export const toIso = (date: Date | null | undefined): string | null => (date ? date.toISOString() : null);

export const toIsoDate = (date: Date | null | undefined): string | null => (date ? date.toISOString().slice(0, 10) : null);

export const toNumber = (value: bigint | number): number => (typeof value === 'bigint' ? Number(value) : value);

export const ratio = ({ value, by }: RatioInput): number | null => (by > 0 ? value / by : null);

export const clampPercent = (value: number | null | undefined): number | null =>
  value === null || value === undefined || !Number.isFinite(value) ? null : clamp(value, { min: 0, max: 100 });

export const clampPercentDelta = (value: number | null | undefined): number | null =>
  value === null || value === undefined || !Number.isFinite(value) ? null : clamp(value, { min: -100, max: 100 });

export const percentOf = ({ value, by }: RatioInput): number | null => (by > 0 ? clampPercent((value * 100) / by) : null);

export const fromUnixSeconds = (seconds: number | null | undefined): Date | null =>
  typeof seconds === 'number' && seconds > 0 ? fromUnixTime(seconds) : null;
