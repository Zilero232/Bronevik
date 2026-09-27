import type { AttendedInput } from './attendance.types';

export const attendedAccounts = ({ battles, bonusTypes }: AttendedInput): Map<bigint, boolean> => {
  const wanted = new Set(bonusTypes.map(String));
  const result = new Map<bigint, boolean>();

  for (const battle of battles) {
    result.set(battle.accountId, result.get(battle.accountId) === true || wanted.has(battle.battleType));
  }

  return result;
};
