import type { TankMath } from '@/shared/api/generated';

export type { TankMath } from '@/shared/api/generated';

export type TankMathConfig = TankMath['top'];

export type TankMathShell = TankMathConfig['shells'][number];

export type TankMathInput = {
  tankId: number;
  signal?: AbortSignal;
};
