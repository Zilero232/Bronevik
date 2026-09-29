import type { PreviousBattleMarksInput } from './previous-battle-marks.types';

import { Prisma } from '../../../../../generated';

export const previousBattleMarksSql = ({ pairs, since }: PreviousBattleMarksInput): Prisma.Sql => Prisma.sql`
  SELECT pair.account_id AS "accountId", pair.tank_id AS "tankId", latest.marks_on_gun AS "marksOnGun"
  FROM unnest(${pairs.map((pair) => pair.accountId)}::bigint[], ${pairs.map((pair) => pair.tankId)}::int[]) AS pair(account_id, tank_id)
  CROSS JOIN LATERAL (
    SELECT b.marks_on_gun
    FROM battle b
    WHERE b.account_id = pair.account_id
      AND b.tank_id = pair.tank_id
      AND b.marks_on_gun IS NOT NULL
      AND b.received_at <= ${since}
    ORDER BY b.started_at DESC
    LIMIT 1
  ) latest
`;
