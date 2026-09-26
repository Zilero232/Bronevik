import type { ModReference, StreamerSettingsView } from '@otmetki/schemas';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { settingsFile, settingsGroups } from '..';
import { STREAMER_SETTINGS_PAGE } from '../../../config';

const provenance = { source: 'editorial', sourceUrl: 'https://example.com/video', checkedAt: '2026-09-26T10:00:00.000Z' } as const;

const modpack: ModReference = {
  id: '5b0b7a36-8d0a-4c4e-9f7a-6f0c1a2b3c4d',
  kind: 'modpack',
  name: 'Pack',
  author: 'Author',
  officialUrl: 'https://example.com/pack',
  onMost: true,
  checkedAt: null
};

const view: StreamerSettingsView = {
  slug: 'jove',
  displayName: 'Jove',
  kind: 'claimed',
  settings: {
    zoom: { steps: ['x2', 'x16'], ...provenance },
    camera: { fov: 95, ...provenance },
    sound: { ...provenance }
  },
  modReferences: [],
  updatedAt: null
};

describe('settingsGroups', () => {
  it('keeps non-empty groups in the canonical order with their provenance', () => {
    const groups = settingsGroups(view);

    expect(groups.map(({ group }) => group)).toEqual(STREAMER_SETTINGS.groups.filter((group) => group === 'camera' || group === 'zoom'));
    expect(groups[0]?.provenance).toEqual(provenance);
  });

  it('shows the mods group when only mod references exist', () => {
    const groups = settingsGroups({ ...view, modReferences: [modpack] });
    const mods = groups.find(({ group }) => group === 'mods');

    expect(mods).toEqual({ group: 'mods', rows: [], provenance: null });
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
