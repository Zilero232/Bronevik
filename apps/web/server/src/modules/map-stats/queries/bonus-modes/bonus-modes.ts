import { entries } from 'remeda';

import { Prisma } from '../../../../../generated';
import { GAME_MODE_BONUS_TYPES } from '../../../../common/lib';

export const bonusModesSql = (): Prisma.Sql =>
  Prisma.sql`(VALUES ${Prisma.join(
    entries(GAME_MODE_BONUS_TYPES).flatMap(([mode, types]) => types.map((type) => Prisma.sql`(${String(type)}::text, ${mode}::text)`))
  )})`;
