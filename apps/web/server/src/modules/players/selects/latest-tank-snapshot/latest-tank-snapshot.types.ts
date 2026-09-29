import type { Prisma } from '../../../../../generated';
import type { LATEST_TANK_SNAPSHOT_SELECT } from './latest-tank-snapshot';

export type LatestTankSnapshot = Prisma.TankSnapshotLatestGetPayload<{ select: typeof LATEST_TANK_SNAPSHOT_SELECT }>;
