export type BattleSample = {
  accountId: bigint;
  capturedAt: Date;
  battles: number;
};

export type AttendedInput = {
  samples: readonly BattleSample[];
  startsAt: Date;
  endsAt: Date;
};

export type NearestInput = {
  samples: readonly BattleSample[];
  at: Date;
};
