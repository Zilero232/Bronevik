import type { Prisma } from '../../../../../generated';
import type { OWN_TANK_SELECT, TANK_RATING_SELECT, TANK_TOTALS_SELECT } from './tank-ratings';

export type OwnTankRow = Prisma.PlayerTankGetPayload<{ select: typeof OWN_TANK_SELECT }>;
export type TankRatingRow = Prisma.AccountTankRatingGetPayload<{ select: typeof TANK_RATING_SELECT }>;
export type TankTotalsRow = Prisma.TankSnapshotLatestGetPayload<{ select: typeof TANK_TOTALS_SELECT }>;
