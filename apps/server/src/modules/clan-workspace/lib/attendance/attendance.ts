import type { AttendedInput, BattleSample, NearestInput } from './attendance.types';

const lastBefore = ({ samples, at }: NearestInput) =>
  samples.filter((sample) => sample.capturedAt <= at).sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime())[0];

const firstAfter = ({ samples, at }: NearestInput) =>
  samples.filter((sample) => sample.capturedAt >= at).sort((a, b) => a.capturedAt.getTime() - b.capturedAt.getTime())[0];

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
