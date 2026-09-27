import { isAfter, isBefore } from 'date-fns';

import type { AvailabilityBounds, AvailabilityInput, AvailabilityState, AvailabilityWindow } from './availability.types';

const stateOf = ({ from, until, now }: AvailabilityBounds): AvailabilityState => {
  if (!from && !until) {
    return 'anytime';
  }

  if (until && now && isBefore(until, now)) {
    return 'ended';
  }

  return from && now && isAfter(from, now) ? 'later' : 'now';
};

export const availabilityWindow = ({ from, until, now }: AvailabilityInput): AvailabilityWindow => {
  const start = from ? new Date(from) : null;
  const end = until ? new Date(until) : null;

  return { state: stateOf({ from: start, until: end, now }), from: start, until: end };
};
