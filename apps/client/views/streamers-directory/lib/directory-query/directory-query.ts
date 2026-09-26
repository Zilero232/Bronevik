import type { StreamerDirectoryFilters } from '@/entities/streamer/streamer';

import type { DirectoryFilterState, DirectoryToggle } from './directory-query.types';

import { DIRECTORY, DIRECTORY_TOGGLES } from '../../config';

export const directoryQuery = ({ live, platform, settings }: DirectoryFilterState): StreamerDirectoryFilters => ({
  ...(live ? { live: 'true' } : {}),
  ...(platform ? { platform } : {}),
  ...(settings ? { hasSettings: 'true' } : {}),
  limit: DIRECTORY.pageSize
});

export const activeToggles = (state: DirectoryFilterState): DirectoryToggle[] => DIRECTORY_TOGGLES.filter((toggle) => state[toggle]);

export const hasDirectoryFilters = (state: DirectoryFilterState): boolean => state.live || state.settings || state.platform !== null;
