import type { SpecVerdict, TankSpecKey } from '@/entities/tank/tank';

export type StatValueProps = {
  statKey: TankSpecKey;
  value: number | null;
  fill: number;
  verdict: SpecVerdict;
  isWinner?: boolean;
  isCompare?: boolean;
};
