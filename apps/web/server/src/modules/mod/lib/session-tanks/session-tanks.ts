import type { TankTotals } from '@otmetki/ratings';

import { groupBy, sumBy } from 'remeda';

import type { SessionBattleRow } from './session-tanks.types';

export const sessionTankTotals = (battles: readonly SessionBattleRow[]): TankTotals[] =>
  Object.values(groupBy(battles, (battle) => String(battle.tankId))).map((rows) => ({
    tankId: rows[0].tankId,
    battles: rows.length,
    wins: rows.filter((row) => row.result === 'win').length,
    damageDealt: sumBy(rows, (row) => row.damageDealt),
    frags: sumBy(rows, (row) => row.frags),
    spotted: sumBy(rows, (row) => row.spotted),
    capturePoints: 0,
    droppedCapturePoints: 0
  }));
