import type { SettingsDiffRow } from '@otmetki/schemas';

import { STREAMER_SETTINGS } from '@otmetki/schemas';

import { groupOfPath, isKnownField } from '@/entities/streamer/settings';

import type { CompareSection } from './compare-sections.types';

export const compareSections = (rows: readonly SettingsDiffRow[]): CompareSection[] =>
  STREAMER_SETTINGS.groups.flatMap((group) => {
    const groupRows = rows.filter((row) => isKnownField(row.field) && groupOfPath(row.field) === group);

    return groupRows.length > 0 ? [{ group, rows: groupRows }] : [];
  });
