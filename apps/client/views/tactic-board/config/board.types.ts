import type { BOARD_DRAW_TOOLS, BOARD_TEAMS, BOARD_TOOLS, CANVAS_TOKENS } from './board.constants';

export type BoardTool = (typeof BOARD_TOOLS)[number];

export type BoardDrawTool = (typeof BOARD_DRAW_TOOLS)[number];

export type BoardTeam = (typeof BOARD_TEAMS)[number];

export type CanvasPalette = Record<keyof typeof CANVAS_TOKENS, string>;
