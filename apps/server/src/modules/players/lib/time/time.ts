import { MOSCOW } from './time.constants';

export const moscowDay = (date: Date): string => new Date(date.getTime() + MOSCOW.offsetMs).toISOString().slice(0, 10);

export const moscowDayStart = (date: Date): Date => {
  const day = moscowDay(date);

  return new Date(Date.parse(`${day}T00:00:00.000Z`) - MOSCOW.offsetMs);
};
