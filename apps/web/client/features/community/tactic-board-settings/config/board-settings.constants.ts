import { MAP_MODE_PREFIXES } from '@/entities/map/map';

export const TACTIC_VISIBILITIES = ['unlisted', 'public', 'private'] as const;

export const BOARD_SETTINGS = {
  none: 'none',
  fallbackModes: Object.values(MAP_MODE_PREFIXES)
} as const;
