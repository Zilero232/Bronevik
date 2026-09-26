import { LEARNING_CURVE, TANK_ECONOMY } from '@otmetki/schemas';

export const TANK_ECONOMY_AGGREGATE = {
  windowDays: TANK_ECONOMY.windowDays,
  randomBattleType: '1',
  minBattles: 20,
  median: 0.5
} as const;

export const LEARNING_CURVE_AGGREGATE = {
  windowDays: LEARNING_CURVE.windowDays,
  bucketStarts: LEARNING_CURVE.bucketStarts,
  maxBattleDelta: 500,
  minBattles: 50
} as const;
