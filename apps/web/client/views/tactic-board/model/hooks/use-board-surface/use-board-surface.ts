'use client';

import { useSize } from '@siberiacancode/reactuse';

import { BOARD } from '../../../config';
import { fitScale } from '../../../lib/board-geometry';
import { useWorkspace } from '../../context';

export const useBoardSurface = () => {
  const { tool, isEditable, textAnchor } = useWorkspace();
  const { ref, snapshot } = useSize<HTMLDivElement>();

  const width = Math.floor(snapshot.width);
  const scale = fitScale({ width, size: BOARD.size });

  return {
    ref,
    width,
    tool,
    isEditable,
    textPosition: textAnchor ? { left: textAnchor.x * scale, top: textAnchor.y * scale } : null
  };
};
