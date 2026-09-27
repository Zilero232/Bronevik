import { fromUnixTime } from 'date-fns';

export const toIso = (date: Date | null | undefined): string | null => (date ? date.toISOString() : null);

export const isoDay = (date: Date): string => date.toISOString().slice(0, 10);

export const toIsoDate = (date: Date | null | undefined): string | null => (date ? isoDay(date) : null);

export const toNumber = (value: bigint | number): number => (typeof value === 'bigint' ? Number(value) : value);

export const fromUnixSeconds = (seconds: number | null | undefined): Date | null =>
  typeof seconds === 'number' && seconds > 0 ? fromUnixTime(seconds) : null;
