import { describe, expect, it } from 'vitest';

import { replayModeOptions } from '../replay-modes';

const MAPS = [
  { arenaId: '01_karelia', modes: ['ctf', 'domination', 'bootcamp'] },
  { arenaId: '02_malinovka', modes: ['ctf', 'assault'] }
];

describe('replayModeOptions', () => {
  it('lists every mode found on any map once, without hidden service modes', () => {
    expect(replayModeOptions({ maps: MAPS, arenaId: null, hidden: ['bootcamp'] })).toEqual(['assault', 'ctf', 'domination']);
  });

  it('narrows the list to the modes of the selected map', () => {
    expect(replayModeOptions({ maps: MAPS, arenaId: '02_malinovka', hidden: [] })).toEqual(['assault', 'ctf']);
  });

  it('falls back to all maps when the selected map is unknown', () => {
    expect(replayModeOptions({ maps: MAPS, arenaId: 'missing', hidden: ['bootcamp'] })).toHaveLength(3);
  });

  it('returns nothing before the map list has loaded', () => {
    expect(replayModeOptions({ maps: [], arenaId: null, hidden: [] })).toEqual([]);
  });
});
