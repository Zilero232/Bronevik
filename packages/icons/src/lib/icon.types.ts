import type { ComponentType, ReactNode, SVGProps } from 'react';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'strokeWidth'> & {
  size?: number | string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  title?: string;
};

export type IconBaseProps = IconProps & {
  name: string;
  children: ReactNode;
};

export type IconComponent = ComponentType<IconProps> & { displayName?: string };

export type CreateIconInput = {
  name: string;
  children: ReactNode;
};

export type StarPathInput = {
  cx: number;
  cy: number;
  outer: number;
  inner?: number;
  points?: number;
};

export type ResolveStrokeInput = {
  size: number | string;
  strokeWidth: number | string;
  absoluteStrokeWidth: boolean;
};

export type GlyphPathInput = {
  glyph: string;
  x: number;
};

export type RhombusBandsInput = {
  cx: number;
  cy: number;
  halfWidth: number;
  halfHeight: number;
  bands: number;
  gap: number;
};

export type LaurelInput = {
  cx: number;
  cy: number;
  radius: number;
  leaves: number;
};

export type LaurelBranchInput = Omit<LaurelInput, 'leaves'> & {
  flip: -1 | 1;
};

export type LeafInput = LaurelBranchInput & {
  angle: number;
  lean: number;
};
