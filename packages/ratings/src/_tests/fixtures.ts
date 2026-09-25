import type { ExpectedValues } from '../expected-values';
import type { TankTotals } from '../stats';
import type { MakeTankInput } from './fixtures.types';

export const UNIT_EXPECTED: ExpectedValues = { tankId: 1, expDamage: 1000, expSpot: 1, expFrag: 1, expDef: 1, expWinRate: 50 };

export const makeTank = ({ tankId, battles, factor = 1 }: MakeTankInput): TankTotals => ({
  tankId,
  battles,
  wins: battles * 0.5 * factor,
  damageDealt: battles * 1000 * factor,
  frags: battles * factor,
  spotted: battles * factor,
  capturePoints: battles * factor,
  droppedCapturePoints: battles * factor,
  xp: battles * 700 * factor,
  survivedBattles: battles * 0.3,
  damageReceived: battles * 900,
  hits: battles * 6,
  shots: battles * 8
});
