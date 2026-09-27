import type { DESIGN_ICONS } from '../../../config';

export type IconSize = (typeof DESIGN_ICONS.sizes)[number];

export type IconStroke = (typeof DESIGN_ICONS.strokes)[number];

export type IconSizing = {
  size: number;
  strokeWidth: number;
};
