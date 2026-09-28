import type { MapSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { BOARD_SETTINGS } from '../../../config';
import { boardModeOptions, boardSettingsSchema, findBoardMap, toBoardSettingsPayload, toBoardSettingsValues } from '../board-settings';

const MAPS: MapSummary[] = [
  {
    arenaId: '05_prohorovka',
    slug: 'prohorovka',
    nameEn: null,
    name: 'Прохоровка',
    image: null,
    sizeMeters: 1000,
    camouflage: 'summer',
    modes: ['ctf', 'assault']
  },
  { arenaId: '02_malinovka', slug: 'malinovka', name: 'Малиновка', nameEn: null, image: null, sizeMeters: 1000, camouflage: 'summer', modes: [] }
];

describe('boardSettingsSchema', () => {
  it('rejects a title made only of spaces', () => {
    expect(boardSettingsSchema.safeParse({ title: '   ', arenaId: 'none', mode: 'none', visibility: 'public' }).success).toBe(false);
  });

  it('trims the title before checking its length', () => {
    const parsed = boardSettingsSchema.parse({ title: '  Прорыв  ', arenaId: 'none', mode: 'none', visibility: 'public' });

    expect(parsed.title).toBe('Прорыв');
  });
});

describe('toBoardSettingsValues', () => {
  it('uses the none sentinel when the board has no map or mode', () => {
    const values = toBoardSettingsValues({ title: 'A', arenaId: null, mode: null, visibility: 'private' });

    expect(values).toEqual({ title: 'A', arenaId: BOARD_SETTINGS.none, mode: BOARD_SETTINGS.none, visibility: 'private' });
  });

  it('defaults a new board to unlisted', () => {
    expect(toBoardSettingsValues(null).visibility).toBe('unlisted');
  });
});

describe('toBoardSettingsPayload', () => {
  it('leaves out map and mode when none is picked', () => {
    const payload = toBoardSettingsPayload({ title: 'A', arenaId: BOARD_SETTINGS.none, mode: BOARD_SETTINGS.none, visibility: 'public' });

    expect(payload).toEqual({ title: 'A', visibility: 'public' });
  });

  it('keeps a picked map and mode', () => {
    const payload = toBoardSettingsPayload({ title: 'A', arenaId: '05_prohorovka', mode: 'ctf', visibility: 'public' });

    expect(payload).toMatchObject({ arenaId: '05_prohorovka', mode: 'ctf' });
  });
});

describe('findBoardMap', () => {
  it('returns null for a board without a map', () => {
    expect(findBoardMap({ maps: MAPS, arenaId: null })).toBeNull();
  });

  it('returns null for an arena missing from the catalog', () => {
    expect(findBoardMap({ maps: MAPS, arenaId: '99_unknown' })).toBeNull();
  });
});

describe('boardModeOptions', () => {
  it('offers the modes of the picked map', () => {
    expect(boardModeOptions({ maps: MAPS, arenaId: '05_prohorovka' })).toEqual(['ctf', 'assault']);
  });

  it('falls back to the generic modes when the map lists none', () => {
    expect(boardModeOptions({ maps: MAPS, arenaId: '02_malinovka' })).toEqual(BOARD_SETTINGS.fallbackModes);
  });
});
