import type { TacticStroke } from '@/shared/api/tactics';

import type { IconAppearance, IconAppearanceInput, StrokeGeometry } from './shape-geometry.types';

import { BOARD, BOARD_TEAMS } from '../../config';
import { circleOf, rectBox } from '../board-geometry';
import { iconGlyph } from '../icon-glyph';

export const strokeGeometry = (stroke: TacticStroke): StrokeGeometry => {
  const [x = 0, y = 0] = stroke.points;

  return {
    anchor: { x, y },
    box: rectBox(stroke.points),
    circle: circleOf(stroke.points),
    pointer: stroke.width * BOARD.arrowPointer,
    fontSize: BOARD.textBaseSize + stroke.width * BOARD.textWidthFactor
  };
};

export const iconAppearance = ({ icon, palette }: IconAppearanceInput): IconAppearance => {
  const team = BOARD_TEAMS[icon.team] ?? 'neutral';
  const glyph = iconGlyph({ kind: icon.kind, size: BOARD.iconSize });

  return {
    glyph,
    fill: glyph.isFilled ? palette[team] : undefined,
    stroke: glyph.isFilled ? palette.background : palette[team],
    labelOffset: BOARD.iconSize / 2 + 4
  };
};
