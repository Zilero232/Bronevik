import type { TankBoundarySqlInput } from './tank-boundary.types';

import { Prisma } from '../../../../../../generated';

export const tankBoundarySql = ({ accountId, mode, cutoff }: TankBoundarySqlInput): Prisma.Sql => Prisma.sql`
  SELECT DISTINCT ON (tank_id)
         tank_id AS "tankId", captured_at AS "capturedAt", battles, wins, losses,
         damage_dealt AS "damageDealt", damage_received AS "damageReceived", frags, spotted, xp,
         survived_battles AS survived, hits, shots,
         capture_points AS "capturePoints", dropped_capture_points AS "droppedCapturePoints"
  FROM tank_snapshot
  WHERE account_id = ${accountId} AND mode = ${mode}::stats_mode AND captured_at <= ${cutoff}
  ORDER BY tank_id, captured_at DESC
`;
