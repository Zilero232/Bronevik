import type { VehicleType } from '@otmetki/schemas';
import type { ComponentType } from 'react';

import type { IconProps, Tier } from '../lib';
import type { Nation } from '../registry';

export type TankClassKind = 'assaultSPG' | VehicleType;

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
  tankClass: TankClassKind;
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

export type RectInput = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FlagLayerProps = {
  layer: FlagLayer;
  mode: NationPalette;
};

export type FlagLayersProps = {
  nation: Nation;
  mode: NationPalette;
};
