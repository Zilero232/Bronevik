import type { TankClassKind, TankClassVariant } from '@bronevik/icons';

export type ClassIconProps = {
  tankClass: TankClassKind;
  variant?: TankClassVariant;
  size?: number;
  className?: string;
};
