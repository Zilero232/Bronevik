import type { WrappedBestBattleSqlInput } from '../wrapped-best-battle';

import { Prisma } from '../../../../../generated';

export const wrappedBusiestMonthSql = ({ accountId, start, end }: WrappedBestBattleSqlInput): Prisma.Sql => Prisma.sql`
  SELECT date_part('month', started_at)::int AS month, SUM(battles)::int AS battles
  FROM play_session
  WHERE account_id = ${accountId} AND started_at >= ${start} AND started_at < ${end}
  GROUP BY 1
  ORDER BY 2 DESC
  LIMIT 1
`;
