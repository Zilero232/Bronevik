import { Prisma } from '../../../../../generated';
import { ACHIEVEMENTS_AGGREGATE } from '../../config';

export const tankOwnersSql = (): Prisma.Sql => Prisma.sql`
  WITH owned AS (
    SELECT pt.tank_id, pt.account_id
    FROM player_tank pt
    JOIN player p ON p.account_id = pt.account_id
    WHERE p.tracking_tier::text IN (${Prisma.join(ACHIEVEMENTS_AGGREGATE.tankTiers)})
      AND (pt.battles > 0 OR pt.in_garage IS TRUE)
  ),
  sample AS (
    SELECT count(DISTINCT account_id)::int AS players FROM owned
  )
  SELECT o.tank_id AS "tankId",
         count(*)::int AS owners,
         (SELECT players FROM sample) AS sample
  FROM owned o
  GROUP BY o.tank_id
`;
