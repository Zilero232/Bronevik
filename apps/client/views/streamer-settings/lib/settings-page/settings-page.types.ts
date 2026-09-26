import type { SettingsGroupKey, SettingsProvenance } from '@otmetki/schemas';

import type { SettingsRow } from '@/entities/streamer/settings';

export type SettingsGroupView = {
  group: SettingsGroupKey;
  rows: SettingsRow[];
  provenance: SettingsProvenance | null;
};

export type SettingsFile = {
  name: string;
  content: string;
  type: string;
};
