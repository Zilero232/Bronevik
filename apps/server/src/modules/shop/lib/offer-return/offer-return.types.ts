export type ReturnEstimate = {
  timesSeen: number;
  lastSeenAt: Date | null;
  medianIntervalDays: number | null;
  nextExpectedAt: Date | null;
};
