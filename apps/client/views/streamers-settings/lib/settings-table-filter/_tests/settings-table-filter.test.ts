import type { SettingsTableRow } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { filterSettingsRows } from '..';

const row = (patch: Partial<SettingsTableRow>): SettingsTableRow => ({
  slug: 'jove',
  displayName: 'Jove',
  isLive: false,
  sniperSensitivity: null,
  fov: null,
  preset: null,
  zoomMax: null,
  modpack: null,
  modsKind: null,
  gpu: null,
  updatedAt: '2026-09-26T10:00:00.000Z',
  ...patch
});

const rows = [
  row({ slug: 'jove', displayName: 'Jove', preset: 'medium', gpu: 'RTX 4090' }),
  row({ slug: 'near-you', displayName: 'Near_You', preset: 'high' })
];

describe('filterSettingsRows', () => {
  it('returns everything without filters', () => {
    expect(filterSettingsRows({ rows, query: '', preset: null })).toEqual(rows);
  });

  it('filters by preset', () => {
    expect(filterSettingsRows({ rows, query: '', preset: 'high' }).map(({ slug }) => slug)).toEqual(['near-you']);
  });

  it('searches name, slug and hardware case-insensitively', () => {
    expect(filterSettingsRows({ rows, query: ' rtx ', preset: null }).map(({ slug }) => slug)).toEqual(['jove']);
    expect(filterSettingsRows({ rows, query: 'NEAR', preset: null }).map(({ slug }) => slug)).toEqual(['near-you']);
    expect(filterSettingsRows({ rows, query: 'rtx', preset: 'high' })).toEqual([]);
  });
});
