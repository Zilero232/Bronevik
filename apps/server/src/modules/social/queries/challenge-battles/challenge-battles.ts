import type { ChallengeBattlesSqlInput } from './challenge-battles.types';

import { Prisma } from '../../../../../generated';
import { corroboratedBattleSql } from '../../../mod';

export const challengeBattlesSql = ({ accountIds, start, end }: ChallengeBattlesSqlInput): Prisma.Sql => Prisma.sql`
  SELECT b.account_id AS "accountId", b.tank_id AS "tankId", b.damage_dealt AS "damageDealt"
  FROM battle b
  WHERE b.account_id = ANY(${[...accountIds]}::bigint[])
    AND b.started_at >= ${start} AND b.started_at < ${end}
    AND ${corroboratedBattleSql}
`;
