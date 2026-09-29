import type { WrappedTopTanksSqlInput } from './wrapped-top-tanks.types';

import { Prisma } from '../../../../../generated';

export const wrappedTopTanksSql = ({ accountId, start, end, limit }: WrappedTopTanksSqlInput): Prisma.Sql => Prisma.sql`
  SELECT tank_id, (MAX(battles) - MIN(battles))::int AS battles, (MAX(damage_dealt) - MIN(damage_dealt))::bigint AS damage
  FROM tank_snapshot
  WHERE account_id = ${accountId} AND mode = 'all'::stats_mode AND captured_at >= ${start} AND captured_at < ${end}
  GROUP BY tank_id
  HAVING MAX(battles) > MIN(battles)
  ORDER BY 2 DESC
  LIMIT ${limit}
`;
