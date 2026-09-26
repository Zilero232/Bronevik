import type { TankClassKind } from '@bronevik/icons';
import type { VehicleImages } from '@bronevik/schemas';

import type { TANK_IMAGE } from './TankImage.constants';

export type TankImageSize = keyof typeof TANK_IMAGE;

export type TankImageSubject = {
  name: string;
  type: TankClassKind;
  tier: number;
  nation: string;
  isPremium?: boolean;
  images?: VehicleImages | null;
};

export type TankImageProps = {
  tank: TankImageSubject;
  size: TankImageSize;
  withTint?: boolean;
  isPriority?: boolean;
  isDecorative?: boolean;
  withFallback?: boolean;
  className?: string;
};
