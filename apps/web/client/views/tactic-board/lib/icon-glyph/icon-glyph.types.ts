import type { TacticIconKind } from '@/entities/tactic/board';

export type IconGlyphInput = {
  kind: TacticIconKind;
  size: number;
};

export type IconGlyph = {
  outline: number[];
  lines: number[][];
  isFilled: boolean;
};
