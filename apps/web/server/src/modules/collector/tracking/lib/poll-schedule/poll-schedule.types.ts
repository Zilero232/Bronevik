import type { TrackingTier } from '../../../../../../generated';

type PollIntervals = {
  activeMinutes: number;
  subscriberMinutes: number;
  populationHours: number;
  dormantDays: number;
};

export type NextPollAtInput = {
  now: Date;
  tier: TrackingTier;
  isSubscriber: boolean;
  intervals: PollIntervals;
};
