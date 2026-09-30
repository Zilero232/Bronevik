import type { ModComponentSet, ModSyncProfile } from '@otmetki/schemas';

import { MOD_SYNC } from '@otmetki/schemas';
import { isIncludedIn, omitBy, unique } from 'remeda';

export const isStoredConfigKey = (key: string): boolean =>
  !isIncludedIn(key, MOD_SYNC.excludedConfigKeys) && !MOD_SYNC.excludedConfigPrefixes.some((prefix) => key.startsWith(prefix));

export const sanitizeSet = (set: ModComponentSet): ModComponentSet => ({ ...set, components: unique(set.components) });

export const sanitizeProfile = (profile: ModSyncProfile): ModSyncProfile => ({
  ...profile,
  data: { ...profile.data, config: omitBy(profile.data.config, (_value, key) => !isStoredConfigKey(key)) }
});
