import type { BattleAnalysis, TankReference, VehicleType } from '@otmetki/schemas';

import type { Battle } from '../../../../../generated';

export type ReviewedBattle = Pick<
  Battle,
  | 'damageAssistedRadio'
  | 'damageAssistedStun'
  | 'damageAssistedTrack'
  | 'damageBlocked'
  | 'damageDealt'
  | 'durationSec'
  | 'frags'
  | 'lifetimeSec'
  | 'moeMovingAvg'
  | 'moePercent'
  | 'moePercentDelta'
  | 'shotsFired'
  | 'shotsHit'
  | 'shotsPierced'
  | 'spotted'
  | 'survived'
>;

export type ReviewInput = {
  battle: ReviewedBattle;
  reference: TankReference | null;
  vehicleType: VehicleType | null;
};

export type BattleReview = Omit<BattleAnalysis, 'battle' | 'reference' | 'rolls'>;

export type RatioToInput = {
  value: number;
  reference: number | null;
};
