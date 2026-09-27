import { Prisma } from '../../../../../generated';
import { BATTLE_CORROBORATION } from '../../config';

export const corroboratedBattleSql = Prisma.sql`(
  EXISTS (
    SELECT 1
    FROM tank_battle_delta corroboration
    WHERE corroboration.account_id = b.account_id
      AND corroboration.tank_id = b.tank_id
      AND corroboration.captured_at >= b.started_at
      AND corroboration.captured_at < b.started_at + make_interval(hours => ${BATTLE_CORROBORATION.windowHours})
      AND corroboration.battles >= 1
      AND corroboration.damage_dealt >= b.damage_dealt
      AND corroboration.frags >= b.frags
  )
  OR EXISTS (
    SELECT 1
    FROM replay corroborating_replay
    WHERE corroborating_replay.account_id = b.account_id
      AND corroborating_replay.arena_unique_id = b.arena_unique_id
      AND corroborating_replay.status = 'parsed'
      AND corroborating_replay.damage_dealt = b.damage_dealt
  )
)`;
