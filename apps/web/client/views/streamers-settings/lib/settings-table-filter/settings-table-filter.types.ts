import type { SettingsTableRow } from '@otmetki/schemas';

export type SettingsTableFilterInput = {
  rows: readonly SettingsTableRow[];
  query: string;
  preset: string | null;
};
