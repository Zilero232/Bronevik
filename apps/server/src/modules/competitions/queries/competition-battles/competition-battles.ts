import type { CompetitionBattlesSqlInput } from './competition-battles.types';

import { Prisma } from '../../../../../generated';
import { corroboratedBattleSql } from '../../../mod';

export const competitionBattlesSql = ({ accountId, battleTypes, from, until, limit }: CompetitionBattlesSqlInput): Prisma.Sql => Prisma.sql`
  SELECT b.tank_id AS "tankId", b.result::text AS "result", b.damage_dealt AS "damageDealt",
         b.damage_assisted_radio AS "damageAssistedRadio", b.damage_assisted_track AS "damageAssistedTrack",
         b.damage_blocked AS "damageBlocked", b.frags, b.spotted, b.xp, b.survived
  FROM battle b
  WHERE b.account_id = ${accountId}
    AND b.battle_type IN (${Prisma.join(battleTypes)})
    AND b.started_at >= ${from} AND b.started_at < ${until}
    AND ${corroboratedBattleSql}
  ORDER BY b.started_at ASC
  LIMIT ${limit}
`;
