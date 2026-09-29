import type { CommonTankIdsInput } from './common-tanks.types';

export const commonTankIds = ({ tanks, accountCount }: CommonTankIdsInput): number[] => {
  const owners = new Map<number, Set<bigint>>();

  for (const tank of tanks) {
    const set = owners.get(tank.tankId) ?? new Set<bigint>();

    set.add(tank.accountId);
    owners.set(tank.tankId, set);
  }

  return [...owners.entries()].filter(([, set]) => set.size === accountCount).map(([tankId]) => tankId);
};
