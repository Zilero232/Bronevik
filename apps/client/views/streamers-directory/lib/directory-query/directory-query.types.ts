import type { StreamerPlatform } from '@otmetki/schemas';

import type { DIRECTORY_PLATFORM_FILTERS, DIRECTORY_TOGGLES } from '../../config';

export type DirectoryToggle = (typeof DIRECTORY_TOGGLES)[number];

export type DirectoryPlatformFilter = (typeof DIRECTORY_PLATFORM_FILTERS)[number];

export type DirectoryFilterState = {
  live: boolean;
  platform: StreamerPlatform | null;
  settings: boolean;
};
