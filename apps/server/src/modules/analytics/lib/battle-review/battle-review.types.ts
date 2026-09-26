import type { BattleAnalysis, TankReference, VehicleSummary, VehicleType } from '@otmetki/schemas';

import type { Battle } from '../../../../../generated';

export type ReviewedBattle = {
  damageDealt: number;
  damageAssistedRadio: number;
  damageAssistedTrack: number;
  damageAssistedStun: number;
  damageBlocked: number;
  frags: number;
  spotted: number;
  survived: boolean;
  lifetimeSec: number | null;
  durationSec: number | null;
  shotsFired: number | null;
  shotsHit: number | null;
  shotsPierced: number | null;
  moePercent: number | null;
  moePercentDelta: number | null;
  moeMovingAvg: number | null;
};

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

export type MyBattleInput = {
  battle: Battle;
  vehicle: VehicleSummary | null;
  mapName: string | null;
};

export type ReferenceRow = {
  battles: number;
  wins: number;
  damage: number;
  assisted: number;
  spotted: number;
  frags: number;
  blocked: number;
};
