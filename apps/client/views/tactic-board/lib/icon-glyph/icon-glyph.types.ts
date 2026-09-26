import type { TacticIconKind } from '@/shared/api/tactics';

export type IconGlyphInput = {
  kind: TacticIconKind;
  size: number;
};

export type IconGlyph = {
  outline: number[];
  lines: number[][];
  isFilled: boolean;
};
