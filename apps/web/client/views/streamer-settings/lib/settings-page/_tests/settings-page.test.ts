import type { StreamerSettingsView } from '@otmetki/schemas';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { settingsFile, settingsGroups } from '..';
import { STREAMER_SETTINGS_PAGE } from '../../../config';

const provenance = { source: 'editorial', sourceUrl: 'https://example.com/video', checkedAt: '2026-09-26T10:00:00.000Z' } as const;

const view: StreamerSettingsView = {
  slug: 'jove',
  displayName: 'Jove',
  kind: 'claimed',
  settings: {
    zoom: { steps: ['x2', 'x16'], ...provenance },
    camera: { fov: 95, ...provenance },
    sound: { ...provenance }
  },
  updatedAt: null
};

describe('settingsGroups', () => {
  it('keeps non-empty groups in the canonical order with their provenance', () => {
    const groups = settingsGroups(view);

    expect(groups.map(({ group }) => group)).toEqual(STREAMER_SETTINGS.groups.filter((group) => group === 'camera' || group === 'zoom'));
    expect(groups[0]?.provenance).toEqual(provenance);
  });
});

describe('settingsFile', () => {
  it('names the file after the slug and round-trips the view', () => {
    const file = settingsFile(view);

    expect(file.name.startsWith(view.slug)).toBe(true);
    expect(file.name.endsWith(STREAMER_SETTINGS_PAGE.file.suffix)).toBe(true);
    expect(JSON.parse(file.content)).toEqual(view);
  });
});
