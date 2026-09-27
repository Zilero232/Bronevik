import type { SettingsGroupKey, SettingsProvenance } from '@otmetki/schemas';

export type SettingsGroupFieldsProps = {
  group: SettingsGroupKey;
  provenance: SettingsProvenance | null;
};
