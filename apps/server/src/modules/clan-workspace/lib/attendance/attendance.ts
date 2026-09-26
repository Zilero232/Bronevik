import { firstBy } from 'remeda';

import type { AttendedInput, BattleSample, NearestInput } from './attendance.types';

const lastBefore = ({ samples, at }: NearestInput) =>
  firstBy(
    samples.filter((sample) => sample.capturedAt <= at),
    [(sample) => sample.capturedAt.getTime(), 'desc']
  );

const firstAfter = ({ samples, at }: NearestInput) =>
  firstBy(
    samples.filter((sample) => sample.capturedAt >= at),
    (sample) => sample.capturedAt.getTime()
  );

export const attendedAccounts = ({ samples, startsAt, endsAt }: AttendedInput): Map<bigint, boolean> => {
  const byAccount = new Map<bigint, BattleSample[]>();

  for (const sample of samples) {
    byAccount.set(sample.accountId, [...(byAccount.get(sample.accountId) ?? []), sample]);
  }

  const result = new Map<bigint, boolean>();

  for (const [accountId, own] of byAccount) {
    const before = lastBefore({ samples: own, at: startsAt });
    const after = firstAfter({ samples: own, at: endsAt });

    if (before && after) {
      result.set(accountId, after.battles > before.battles);
    }
  }

  return result;
};
