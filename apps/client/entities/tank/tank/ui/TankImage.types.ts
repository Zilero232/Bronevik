import type { TankImageSize } from '../config';
import type { TankIdentityData } from '../model/tank.types';

export type TankImageProps = {
  tank: TankIdentityData;
  size: TankImageSize;
  withBackdrop?: boolean;
  isPriority?: boolean;
  isDecorative?: boolean;
  withFallback?: boolean;
  className?: string;
};
