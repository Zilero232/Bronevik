import type { SettingsValues } from '@otmetki/schemas';

import type { PREFERENCES_TAGS } from '../../config';

export type PreferencesField = (typeof PREFERENCES_TAGS.fields)[number];

export type PreferencesImport = {
  values: SettingsValues;
  found: string[];
};

export type ReadTagInput = {
  document: Document;
  selectors: readonly string[];
};

export type AddValueInput = {
  target: PreferencesImport;
  path: string;
  value: unknown;
};
