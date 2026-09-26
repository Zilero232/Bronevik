import { STREAMER_SETTINGS } from '@otmetki/schemas';

export const STREAMERS_SETTINGS_PAGE = {
  initialSorting: [{ id: 'updated', desc: true }],
  allPresets: 'all',
  iconSize: 15,
  defaultCohort: STREAMER_SETTINGS.cohorts[0],
  sensitivityDigits: 2
} as const;
