import { Prisma } from '../../../../../generated';
import { PLAYER_MARKS } from '../../config';

export const combinedDamageSql = (accountId: bigint) => Prisma.sql`
  SELECT tank_id, count(*)::float8 AS battles,
         avg(damage_dealt + greatest(damage_assisted_radio, damage_assisted_track, damage_assisted_stun))::float8 AS combined
  FROM (
    SELECT tank_id, damage_dealt, damage_assisted_radio, damage_assisted_track, damage_assisted_stun,
           row_number() OVER (PARTITION BY tank_id ORDER BY started_at DESC) AS position
    FROM battle
    WHERE account_id = ${accountId}
  ) recent
  WHERE position <= ${PLAYER_MARKS.combinedDamageBattles}
  GROUP BY tank_id
`;
