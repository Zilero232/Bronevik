import type { StreamerSettingsView } from '@otmetki/schemas';

import { streamersControllerCompareSettings } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const compareStreamerSettings = (slugs: readonly string[]): Promise<StreamerSettingsView[]> =>
  fromSdk(() => streamersControllerCompareSettings({ query: { slugs: slugs.join(',') } }));
