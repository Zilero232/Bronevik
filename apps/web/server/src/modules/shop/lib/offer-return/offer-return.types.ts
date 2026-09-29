export type ReturnEstimate = {
  timesSeen: number;
  lastSeenAt: Date | null;
  medianIntervalDays: number | null;
  nextExpectedAt: Date | null;
};

type PastOffer = {
  endsAt: Date | null;
  lastSeenAt: Date;
};

export type AbsenceBeforeReturnInput = {
  previous: readonly PastOffer[];
  now: Date;
  minDays: number;
};
