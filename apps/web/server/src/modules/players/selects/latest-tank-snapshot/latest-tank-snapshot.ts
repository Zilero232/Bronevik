import type { Prisma } from '../../../../../generated';

export const LATEST_TANK_SNAPSHOT_SELECT = {
  tankId: true,
  battles: true,
  wins: true,
  damageDealt: true,
  frags: true,
  xp: true,
  survived: true,
  maxFrags: true,
  maxXp: true
} as const satisfies Prisma.TankSnapshotLatestSelect;
