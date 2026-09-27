import type { SettingsTableRow } from '@otmetki/schemas';

import type { SettingsTableFilterInput } from './settings-table-filter.types';

const haystack = (row: SettingsTableRow): string =>
  [row.displayName, row.slug, row.gpu]
    .filter((part): part is string => Boolean(part))
    .join(' ')
    .toLowerCase();

export const filterSettingsRows = ({ rows, query, preset }: SettingsTableFilterInput): SettingsTableRow[] => {
  const needle = query.trim().toLowerCase();

  return rows.filter((row) => (preset === null || row.preset === preset) && (needle === '' || haystack(row).includes(needle)));
};
