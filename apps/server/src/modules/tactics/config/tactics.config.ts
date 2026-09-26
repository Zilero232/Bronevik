export const TACTICS = {
  path: '/tactics/ws',
  documentPrefix: 'board:',
  debounceMs: 2000,
  maxDebounceMs: 10_000,
  maxBoardsPerUser: 200
} as const;

export const BOARD_DOCUMENT = {
  layersKey: 'layers'
} as const;
