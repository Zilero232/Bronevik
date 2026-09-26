import { addMilliseconds } from 'date-fns';
import { millisecondsInDay } from 'date-fns/constants';
import { identity, sortBy, unique } from 'remeda';

import type { ReturnEstimate } from './offer-return.types';

import { OFFER_RETURN } from '../../config';

const median = (values: readonly number[]): number => {
  const sorted = sortBy(values, identity());
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 1 ? (sorted[middle] ?? 0) : ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
};

export const returnEstimate = (appearances: readonly Date[]): ReturnEstimate => {
  const times = sortBy(unique(appearances.map((date) => date.getTime())), identity());
  const last = times.at(-1);

  if (last === undefined) {
    return { timesSeen: 0, lastSeenAt: null, medianIntervalDays: null, nextExpectedAt: null };
  }

  if (times.length < OFFER_RETURN.minOccurrences) {
    return { timesSeen: times.length, lastSeenAt: new Date(last), medianIntervalDays: null, nextExpectedAt: null };
  }

  const intervals = times.slice(1).map((time, index) => time - (times[index] ?? time));
  const interval = median(intervals);

  return {
    timesSeen: times.length,
    lastSeenAt: new Date(last),
    medianIntervalDays: Math.round((interval / millisecondsInDay) * 10) / 10,
    nextExpectedAt: addMilliseconds(last, interval)
  };
};
