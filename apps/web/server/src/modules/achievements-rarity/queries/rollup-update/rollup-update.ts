import type { RollupUpdateInput } from './rollup-update.types';

import { Prisma } from '../../../../../generated';

export const rollupUpdateSql = ({ rows, computedAt }: RollupUpdateInput): Prisma.Sql => Prisma.sql`
  UPDATE account_achievements a
  SET held = v.held,
      points = v.points,
      completion = v.completion,
      computed_at = ${computedAt}
  FROM unnest(
    ${rows.map((row) => String(row.accountId))}::text[],
    ${rows.map((row) => row.held)}::int[],
    ${rows.map((row) => row.points)}::int[],
    ${rows.map((row) => row.completion)}::float8[]
  ) AS v(account_id, held, points, completion)
  WHERE a.account_id = v.account_id::bigint
`;
