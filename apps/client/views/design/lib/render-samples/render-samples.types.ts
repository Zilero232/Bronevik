import type { TankIdentityData, TankImageSize } from '@/entities/tank/tank';

export type RenderSample = {
  key: string;
  size: TankImageSize;
  tank: TankIdentityData;
};
