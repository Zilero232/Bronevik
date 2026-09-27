import { describe, expect, it } from 'vitest';

import { DIRECTORY } from '../../../config';
import { activeToggles, directoryQuery, hasDirectoryFilters } from '../directory-query';

const NONE = { live: false, platform: null, settings: false } as const;

describe('directoryQuery', () => {
  it('asks for the first page only when nothing is filtered', () => {
    expect(directoryQuery(NONE)).toEqual({ limit: DIRECTORY.pageSize });
  });

  it('sends the boolean filters as the strings the API expects', () => {
    expect(directoryQuery({ live: true, platform: 'twitch', settings: true })).toEqual({
      live: 'true',
      platform: 'twitch',
      hasSettings: 'true',
      limit: DIRECTORY.pageSize
    });
  });
});

describe('activeToggles', () => {
  it('lists the switched-on toggles in a stable order', () => {
    expect(activeToggles({ ...NONE, settings: true, live: true })).toEqual(['live', 'settings']);
    expect(activeToggles(NONE)).toEqual([]);
  });
});

describe('hasDirectoryFilters', () => {
  it('reports any filter, including the platform', () => {
    expect(hasDirectoryFilters(NONE)).toBe(false);
    expect(hasDirectoryFilters({ ...NONE, platform: 'youtube' })).toBe(true);
    expect(hasDirectoryFilters({ ...NONE, live: true })).toBe(true);
  });
});
