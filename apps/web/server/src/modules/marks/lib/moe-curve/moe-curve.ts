import type { MoeCurvePoint } from '@otmetki/schemas';

import { MOE_CURVE } from '@otmetki/schemas';
import { range } from 'remeda';

import type { CurvePointRow } from './moe-curve.types';

export const curveSteps = (): number[] =>
  range(0, Math.floor((MOE_CURVE.toPercent - MOE_CURVE.fromPercent) / MOE_CURVE.stepPercent) + 1).map(
    (index) => MOE_CURVE.fromPercent + index * MOE_CURVE.stepPercent
  );

export const curvePoints = (rows: readonly CurvePointRow[]): MoeCurvePoint[] =>
  rows
    .filter((row) => row.players >= MOE_CURVE.minPlayers && Number.isFinite(row.damage) && row.damage > 0)
    .map((row) => ({ percent: row.percent, damage: Math.round(row.damage), players: row.players, battles: row.battles }));
