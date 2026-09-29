import { describe, expect, it } from 'vitest';

import type { BoardTool } from '../board-tools.types';

import { BOARD_DRAW_TOOLS } from '../../../config';
import { isDrawTool, isItemTool } from '../board-tools';

describe('isDrawTool', () => {
  it('accepts every drag-to-draw tool', () => {
    expect(BOARD_DRAW_TOOLS.every(isDrawTool)).toBe(true);
  });

  it('rejects text, icons and the eraser, which act on a click', () => {
    const clickTools: BoardTool[] = ['text', 'icon', 'eraser', 'select'];

    expect(clickTools.some(isDrawTool)).toBe(false);
  });
});

describe('isItemTool', () => {
  it('lets only select and eraser hit existing items', () => {
    expect(isItemTool('select')).toBe(true);
    expect(isItemTool('eraser')).toBe(true);
    expect(isItemTool('pen')).toBe(false);
  });
});
