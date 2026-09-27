import type { BuildRanksSqlInput } from './build-ranks.types';

import { Prisma } from '../../../../../../generated';
import { BUILD_USAGE_AGGREGATE } from '../../lib/build-usage';

export const buildRanksSql = ({ since, battleTypes }: BuildRanksSqlInput): Prisma.Sql => Prisma.sql`
  WITH pairs AS (
    SELECT DISTINCT tank_id, account_id
    FROM battle
    WHERE started_at >= ${since} AND battle_type = ANY(${battleTypes}::text[]) AND loadout IS NOT NULL
  )
  SELECT ranked.tank_id, ranked.account_id, ranked.rank
  FROM (
    SELECT tank_id, account_id, percent_rank() OVER (PARTITION BY tank_id ORDER BY wn8 DESC) AS rank
    FROM account_tank_rating
    WHERE tank_id IN (SELECT tank_id FROM pairs)
      AND period = 'overall'
      AND wn8 IS NOT NULL
      AND battles >= ${BUILD_USAGE_AGGREGATE.cohortMinBattles}
  ) ranked
  JOIN pairs USING (tank_id, account_id)
`;
