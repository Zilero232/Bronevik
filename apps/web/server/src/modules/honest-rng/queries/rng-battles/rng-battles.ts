import type { RngBattlesSqlInput } from './rng-battles.types';

import { Prisma } from '../../../../../generated';
import { corroboratedBattleSql } from '../../../mod';

export const rngBattlesSql = ({ watermark, until, limit }: RngBattlesSqlInput): Prisma.Sql => Prisma.sql`
  SELECT b.id, b.account_id AS "accountId", b.tank_id AS "tankId", b.started_at AS "startedAt", b.received_at AS "receivedAt",
         b.shots, b.shots_fired AS "shotsFired", b.shots_hit AS "shotsHit", b.shots_pierced AS "shotsPierced"
  FROM battle b
  WHERE b.shots IS NOT NULL
    AND b.received_at < ${until}
    ${watermark ? Prisma.sql`AND (b.received_at, b.id) > (${watermark.receivedAt}, ${watermark.id})` : Prisma.empty}
    AND ${corroboratedBattleSql}
  ORDER BY b.received_at, b.id
  LIMIT ${limit}
`;
