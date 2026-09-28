import type { TankRecordsSqlInput } from './tank-records.types';

import { Prisma } from '../../../../../generated';

export const tankRecordsSql = ({ accountId, tankIds, battleTypes }: TankRecordsSqlInput) => Prisma.sql`
  SELECT
    b.tank_id AS "tankId",
    MAX(b.damage_dealt)::int AS "maxDamage",
    MAX(b.damage_assisted_radio + b.damage_assisted_track)::int AS "maxAssist",
    MAX(b.frags)::int AS "maxFrags",
    MAX(b.xp)::int AS "maxXp"
  FROM battle b
  WHERE b.account_id = ${accountId}
    AND b.tank_id = ANY(${tankIds}::int[])
    AND b.battle_type = ANY(${battleTypes}::text[])
  GROUP BY b.tank_id
`;
