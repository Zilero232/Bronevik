import type { BOARD_DRAW_TOOLS, BOARD_TEAMS, BOARD_TOOLS } from '../../config';

export type BoardTool = (typeof BOARD_TOOLS)[number];

export type BoardDrawTool = (typeof BOARD_DRAW_TOOLS)[number];

export type BoardTeam = (typeof BOARD_TEAMS)[number];
