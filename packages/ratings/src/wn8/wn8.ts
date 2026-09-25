import type { AccountWn8Input, AccountWn8Result, TankWn8Input, Wn8Breakdown, Wn8NormalizeInput, Wn8Ratios } from './wn8.types';

import { safeDivide } from '../stats';
import { WN8 } from './wn8.constants';

const normalize = ({ ratio, floor }: Wn8NormalizeInput): number => Math.max(0, (ratio - floor) / (1 - floor));

export const wn8FromRatios = (ratios: Wn8Ratios): Wn8Breakdown => {
  const rWinC = normalize({ ratio: ratios.rWin, floor: WN8.floor.win });
  const rDamageC = normalize({ ratio: ratios.rDamage, floor: WN8.floor.damage });
  const rFragC = Math.min(rDamageC + WN8.cap.fragOverDamage, normalize({ ratio: ratios.rFrag, floor: WN8.floor.frag }));
  const rSpotC = Math.min(rDamageC + WN8.cap.spotOverDamage, normalize({ ratio: ratios.rSpot, floor: WN8.floor.spot }));
  const rDefC = Math.min(rDamageC + WN8.cap.defOverDamage, normalize({ ratio: ratios.rDef, floor: WN8.floor.def }));

  const wn8 =
    WN8.weight.damage * rDamageC +
    WN8.weight.damageFrag * rDamageC * rFragC +
    WN8.weight.fragSpot * rFragC * rSpotC +
    WN8.weight.defFrag * rDefC * rFragC +
    WN8.weight.win * Math.min(WN8.cap.win, rWinC);

  return { ...ratios, rDamageC, rSpotC, rFragC, rDefC, rWinC, wn8 };
};

export const tankWn8 = ({ totals, expected }: TankWn8Input): number | null => {
  if (totals.battles === 0) {
    return null;
  }

  const { battles } = totals;

  return wn8FromRatios({
    rDamage: safeDivide({ value: totals.damageDealt / battles, by: expected.expDamage }),
    rSpot: safeDivide({ value: totals.spotted / battles, by: expected.expSpot }),
    rFrag: safeDivide({ value: totals.frags / battles, by: expected.expFrag }),
    rDef: safeDivide({ value: totals.droppedCapturePoints / battles, by: expected.expDef }),
    rWin: safeDivide({ value: (totals.wins / battles) * 100, by: expected.expWinRate })
  }).wn8;
};

export const accountWn8 = ({ tanks, expected }: AccountWn8Input): AccountWn8Result => {
  const actual = { battles: 0, damage: 0, spot: 0, frag: 0, def: 0, wins: 0 };
  const target = { damage: 0, spot: 0, frag: 0, def: 0, wins: 0 };
  const tanksWithoutExpected: number[] = [];
  let battlesWithoutExpected = 0;

  for (const tank of tanks) {
    if (tank.battles === 0) {
      continue;
    }

    const values = expected.get(tank.tankId);

    if (!values) {
      tanksWithoutExpected.push(tank.tankId);
      battlesWithoutExpected += tank.battles;

      continue;
    }

    actual.battles += tank.battles;
    actual.damage += tank.damageDealt;
    actual.spot += tank.spotted;
    actual.frag += tank.frags;
    actual.def += tank.droppedCapturePoints;
    actual.wins += tank.wins;

    target.damage += values.expDamage * tank.battles;
    target.spot += values.expSpot * tank.battles;
    target.frag += values.expFrag * tank.battles;
    target.def += values.expDef * tank.battles;
    target.wins += (values.expWinRate / 100) * tank.battles;
  }

  if (actual.battles === 0) {
    return { wn8: null, battles: 0, battlesWithoutExpected, tanksWithoutExpected };
  }

  const { wn8 } = wn8FromRatios({
    rDamage: safeDivide({ value: actual.damage, by: target.damage }),
    rSpot: safeDivide({ value: actual.spot, by: target.spot }),
    rFrag: safeDivide({ value: actual.frag, by: target.frag }),
    rDef: safeDivide({ value: actual.def, by: target.def }),
    rWin: safeDivide({ value: actual.wins, by: target.wins })
  });

  return { wn8, battles: actual.battles, battlesWithoutExpected, tanksWithoutExpected };
};
