export type AvailabilityState = 'anytime' | 'ended' | 'later' | 'now';

export type AvailabilityInput = {
  from: string | null;
  until: string | null;
  now: Date;
};

export type AvailabilityWindow = {
  state: AvailabilityState;
  from: Date | null;
  until: Date | null;
};

export type AvailabilityBounds = {
  from: Date | null;
  until: Date | null;
  now: Date;
};
