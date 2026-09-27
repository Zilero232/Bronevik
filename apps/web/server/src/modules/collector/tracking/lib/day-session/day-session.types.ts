import type { ExpectedValuesTable } from '@otmetki/ratings';

import type { Prisma, TankBattleDelta } from '../../../../../../generated';

export type DaySessionDelta = Pick<
  TankBattleDelta,
  | 'battles'
  | 'capturedAt'
  | 'capturePoints'
  | 'damageBlocked'
  | 'damageDealt'
  | 'droppedCapturePoints'
  | 'frags'
  | 'spotted'
  | 'survived'
  | 'tankId'
  | 'wins'
  | 'xp'
>;

export type BuildDaySessionInput = {
  accountId: bigint;
  day: Date;
  deltas: readonly DaySessionDelta[];
  expected: ExpectedValuesTable;
};

export type DaySession = Prisma.PlaySessionUncheckedCreateInput & {
  day: Date;
};

export type TotalInput = {
  rows: readonly DaySessionDelta[];
  field: keyof Omit<DaySessionDelta, 'capturedAt' | 'tankId'>;
};
