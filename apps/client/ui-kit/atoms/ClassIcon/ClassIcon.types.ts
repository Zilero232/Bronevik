import type { TankClassKind, TankClassVariant } from '@otmetki/icons';

export type ClassIconProps = {
  tankClass: TankClassKind;
  variant?: TankClassVariant;
  size?: number;
  className?: string;
};
