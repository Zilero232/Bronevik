import { addDays, addHours, addMinutes } from 'date-fns';
import { match } from 'ts-pattern';

import type { NextPollAtInput } from './poll-schedule.types';

export const nextPollAt = ({ now, tier, isSubscriber, intervals }: NextPollAtInput): Date =>
  match(tier)
    .with('active', () => addMinutes(now, isSubscriber ? intervals.subscriberMinutes : intervals.activeMinutes))
    .with('population', () => addHours(now, intervals.populationHours))
    .with('dormant', () => addDays(now, intervals.dormantDays))
    .exhaustive();
