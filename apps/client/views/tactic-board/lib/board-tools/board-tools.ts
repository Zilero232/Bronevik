import type { BoardDrawTool, BoardTool } from '../../config';

import { BOARD_DRAW_TOOLS } from '../../config';

const DRAW_TOOLS: ReadonlySet<BoardTool> = new Set(BOARD_DRAW_TOOLS);

export const isDrawTool = (tool: BoardTool): tool is BoardDrawTool => DRAW_TOOLS.has(tool);

export const isItemTool = (tool: BoardTool): boolean => tool === 'select' || tool === 'eraser';
