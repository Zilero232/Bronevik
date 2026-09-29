import { STORAGE_KEYS } from '@/shared/constants';

export const PIN_SCOPES = {
  tanks: STORAGE_KEYS.pinnedTanks,
  maps: STORAGE_KEYS.pinnedMaps
} as const;

export const PIN_ROWS = {
  limit: 50,
  iconSize: 14
} as const;
