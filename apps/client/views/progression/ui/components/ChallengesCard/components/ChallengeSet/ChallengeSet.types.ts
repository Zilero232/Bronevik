import type { TankChallenge, VehicleSummary } from '@otmetki/schemas';

export type ChallengeSetProps = {
  tankId: number;
  vehicle: VehicleSummary | null;
  items: readonly TankChallenge[];
};
