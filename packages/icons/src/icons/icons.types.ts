import type { VehicleType } from '@bronevik/schemas';
import type { ComponentType } from 'react';

import type { IconProps, Tier } from '../lib';

export type MarkCount = 1 | 2 | 3;

export type MarkStyle = 'rings' | 'stars';

export type MasteryLevel = 'first' | 'master' | 'second' | 'third';

export type TankClassVariant = 'elite' | 'premium' | 'regular';

export type NationPalette = 'color' | 'mono';

export type MarkOfExcellenceIconProps = IconProps & {
  marks: MarkCount;
  markStyle?: MarkStyle;
};

export type MasteryIconProps = IconProps & {
  level: MasteryLevel;
  tinted?: boolean;
};

export type TierIconProps = IconProps & {
  tier: Tier;
  withRails?: boolean;
  engraved?: boolean;
};

export type TankClassGlyphProps = IconProps & {
  variant?: TankClassVariant;
};

export type TankClassIconProps = TankClassGlyphProps & {
  tankClass: VehicleType;
};

export type TankClassIconComponent = ComponentType<TankClassGlyphProps> & { displayName?: string };

export type NationIconProps = IconProps & {
  palette?: NationPalette;
};

export type NationIconComponent = ComponentType<NationIconProps> & { displayName?: string };

export type FlagLayer = {
  d: string;
  color: string;
  mono: number;
  evenOdd?: boolean;
  strokeWidth?: number;
};
