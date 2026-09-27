import { MOCK_TIME } from '../../config';

export const dayOf = (unix: number): number => Math.floor((unix + MOCK_TIME.zoneOffsetSec) / MOCK_TIME.daySec);

export const dayStart = (day: number): number => day * MOCK_TIME.daySec - MOCK_TIME.zoneOffsetSec;

export const weekdayOf = (day: number): number => (day + 4) % 7;

export const isWeekend = (day: number): boolean => {
  const weekday = weekdayOf(day);

  return weekday === 0 || weekday === 6;
};

export const hourOf = (unix: number): number => ((unix + MOCK_TIME.zoneOffsetSec) % MOCK_TIME.daySec) / 3600;

export const nowUnix = (): number => Math.floor(Date.now() / 1000);
