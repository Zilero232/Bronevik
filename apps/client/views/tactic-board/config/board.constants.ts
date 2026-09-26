import type { TacticIconKind } from '@/shared/api/tactics';

export const BOARD = {
  size: 1000,
  gridCells: 10,
  gridRows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
  minPointDistance: 3,
  minShapeSize: 6,
  precision: 10,
  textBaseSize: 14,
  textWidthFactor: 2,
  iconSize: 30,
  hitStrokeWidth: 18,
  arrowPointer: 3,
  selectionBlur: 14,
  penTension: 0.4,
  iconLabelWidth: 80,
  cursorThrottleMs: 60,
  undoCaptureMs: 400
} as const;

export const BOARD_LIMITS = {
  layers: 20,
  strokes: 2000,
  icons: 500,
  points: 4000,
  text: 500,
  layerName: 64
} as const;

export const BOARD_DRAW_TOOLS = ['pen', 'arrow', 'line', 'circle', 'rect'] as const;

export const BOARD_TOOLS = ['select', ...BOARD_DRAW_TOOLS, 'text', 'icon', 'eraser'] as const;

export const BOARD_ICON_KINDS = ['lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG', 'flag', 'marker'] as const;

export const BOARD_TEAMS = ['ally', 'enemy', 'neutral'] as const;

export const BOARD_COLORS = ['#ffd24d', '#ff8c42', '#ff4d4f', '#45d483', '#3fc5ff', '#5b7cff', '#c77dff', '#e6e6e6'] as const;

export const BOARD_WIDTHS = [2, 4, 8] as const;

export const BOARD_DEFAULTS = {
  tool: 'pen',
  iconKind: 'mediumTank',
  team: 'ally',
  color: BOARD_COLORS[0],
  width: BOARD_WIDTHS[1]
} as const;

export const BOARD_SOCKET = {
  path: '/tactics/ws',
  documentPrefix: 'board:',
  layersKey: 'layers'
} as const;

export const BOARD_ICON_BANDS = {
  lightTank: 0,
  mediumTank: 1,
  heavyTank: 2,
  'AT-SPG': 0,
  SPG: 0,
  flag: 0,
  marker: 0
} as const satisfies Record<TacticIconKind, number>;

export const CANVAS_TOKENS = {
  background: '--color-surface-sunken',
  grid: '--color-border',
  gridStrong: '--color-border-strong',
  label: '--color-text-dim',
  text: '--color-text',
  selection: '--color-accent',
  ally: '--color-ally',
  enemy: '--color-enemy',
  neutral: '--color-warning'
} as const;

export const CANVAS_FALLBACK = {
  background: '#15181c',
  grid: '#2a2f36',
  gridStrong: '#3a414a',
  label: '#6b7480',
  text: '#e6e8eb',
  selection: '#ff8c42',
  ally: '#45d483',
  enemy: '#ff4d4f',
  neutral: '#ffd24d'
} as const satisfies Record<keyof typeof CANVAS_TOKENS, string>;

export const BOARD_STATUS_TONE = {
  connected: 'success',
  connecting: 'warning',
  disconnected: 'danger',
  denied: 'danger'
} as const;

export const BOARD_PAGE = {
  tokenParam: 'token',
  retries: 2
} as const;
