import type { StreamerSettingsView } from '@otmetki/schemas';

import { STREAMER_SETTINGS } from '@otmetki/schemas';

import { settingsRows } from '@/entities/streamer/settings';

import type { SettingsFile, SettingsGroupView } from './settings-page.types';

import { STREAMER_SETTINGS_PAGE } from '../../config';

export const settingsGroups = ({ settings }: Pick<StreamerSettingsView, 'settings'>): SettingsGroupView[] =>
  STREAMER_SETTINGS.groups.flatMap((group) => {
    const rows = settingsRows(settings, group);
    const content = settings[group];

    if (rows.length === 0) {
      return [];
    }

    return [{ group, rows, provenance: content ? { source: content.source, sourceUrl: content.sourceUrl, checkedAt: content.checkedAt } : null }];
  });

export const settingsFile = (view: StreamerSettingsView): SettingsFile => ({
  name: `${view.slug}${STREAMER_SETTINGS_PAGE.file.suffix}`,
  content: JSON.stringify(view, null, STREAMER_SETTINGS_PAGE.file.indent),
  type: STREAMER_SETTINGS_PAGE.file.type
});
