import type { Prisma } from '../../../../../generated';
import type { MoeValues } from './player-tank-moe.types';

import { moePercent } from '../../lib/battle';

export const toPlayerTankMoe = (moe: MoeValues) =>
  ({
    marksOnGun: moe.marks_on_gun,
    moePercent: moePercent(moe.damage_rating),
    moeMovingDamage: moe.moving_avg_damage,
    moeUpdatedAt: new Date()
  }) satisfies Prisma.PlayerTankUpdateInput;
