import type { TankSpecKey } from '@/entities/tank/tank';

export type ParamSharesInput = {
  key: TankSpecKey;
  values: readonly (number | null | undefined)[];
};
