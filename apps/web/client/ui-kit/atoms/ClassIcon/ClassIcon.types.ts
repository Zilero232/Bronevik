import type { TankClassKind, TankClassVariant } from '@otmetki/icons';

type ClassIconDisplay = 'glyph' | 'tag';

export type ClassIconProps = {
  tankClass: TankClassKind;
  variant?: TankClassVariant;
  display?: ClassIconDisplay;
  size?: number;
  className?: string;
};
