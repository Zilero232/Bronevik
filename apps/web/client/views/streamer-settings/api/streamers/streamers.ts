import type { SettingsHistoryEntry, StreamerSettingsView } from '@otmetki/schemas';

import { streamersControllerSettingsBySlug, streamersControllerSettingsHistory } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const getStreamerSettings = (slug: string): Promise<StreamerSettingsView> =>
  fromSdk(() => streamersControllerSettingsBySlug({ path: { slug } }));

export const getStreamerSettingsHistory = (slug: string): Promise<SettingsHistoryEntry[]> =>
  fromSdk(() => streamersControllerSettingsHistory({ path: { slug } }));
