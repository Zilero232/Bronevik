import type { TankImageSize } from '../config';
import type { TankIdentityData } from '../model/tank.types';

export type TankIdentityProps = {
  tank: TankIdentityData;
  size?: 'lg' | 'md';
  withNation?: boolean;
  image?: Exclude<TankImageSize, 'big'>;
  className?: string;
};
