import type { Prisma } from '../../../../../generated';

export const OWN_TANK_SELECT = {
  tankId: true,
  battles: true,
  wins: true,
  markOfMastery: true,
  marksOnGun: true,
  moePercent: true
} as const satisfies Prisma.PlayerTankSelect;

export const TANK_RATING_SELECT = {
  tankId: true,
  battles: true,
  winRate: true,
  avgDamage: true,
  wn8: true
} as const satisfies Prisma.AccountTankRatingSelect;

export const TANK_TOTALS_SELECT = {
  tankId: true,
  battles: true,
  wins: true,
  damageDealt: true,
  markOfMastery: true,
  marksOnGun: true,
  maxFrags: true,
  maxXp: true
} as const satisfies Prisma.TankSnapshotLatestSelect;
