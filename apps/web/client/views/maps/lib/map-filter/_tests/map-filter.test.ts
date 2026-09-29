import type { MapSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { MAP_MODE_PREFIXES } from '@/entities/map/map';

import { MAP_SIZE_BOUNDS } from '../../../config';
import { filterMaps, mapSizeClass, normalizeMapName } from '../map-filter';

const map = (arenaId: string, name: string, camouflage: string | null, modes: string[]): MapSummary => ({
  arenaId,
  slug: arenaId.replaceAll('_', '-'),
  nameEn: null,
  name,
  image: null,
  sizeMeters: 1_000,
  camouflage,
  modes
});

const MODE = MAP_MODE_PREFIXES;

const MAPS = [
  map('01_karelia', 'Карелия', 'summer', [MODE.standard, MODE.encounter]),
  map('10_hills', 'Рудники', 'summer', [MODE.standard, `${MODE.assault}2`]),
  map('28_desert', 'Песчаная река', 'desert', [MODE.standard]),
  map('73_asia_korea', 'Священная долина', 'winter', [MODE.standard, MODE.onslaught]),
  map('99_unknown', 'Неизвестная', null, ['frontline'])
];

const ids = (maps: MapSummary[]) => maps.map(({ arenaId }) => arenaId);

const ALL = { maps: MAPS, query: '', modes: [], camouflages: [] };

describe('filterMaps', () => {
  it('returns every map when nothing is selected', () => {
    expect(filterMaps(ALL)).toHaveLength(MAPS.length);
  });

  it('finds a map by part of its name regardless of case', () => {
    expect(ids(filterMaps({ ...ALL, query: 'КАРЕЛ' }))).toEqual(['01_karelia']);
  });

  it('ignores spaces and hyphens in the query', () => {
    expect(ids(filterMaps({ ...ALL, query: 'песчаная-река' }))).toEqual(['28_desert']);
  });

  it('also matches the arena id and the slug', () => {
    expect(ids(filterMaps({ ...ALL, query: 'hills' }))).toEqual(['10_hills']);
    expect(ids(filterMaps({ ...ALL, query: 'asia-korea' }))).toEqual(['73_asia_korea']);
  });

  it('keeps maps that support any of the chosen modes, whatever the mode revision', () => {
    expect(ids(filterMaps({ ...ALL, modes: ['assault', 'onslaught'] }))).toEqual(['10_hills', '73_asia_korea']);
  });

  it('keeps only maps with the chosen camouflage and drops maps without one', () => {
    expect(ids(filterMaps({ ...ALL, camouflages: ['desert'] }))).toEqual(['28_desert']);
    expect(ids(filterMaps({ ...ALL, camouflages: ['summer', 'winter', 'desert'] }))).not.toContain('99_unknown');
  });

  it('applies every filter at once', () => {
    expect(filterMaps({ maps: MAPS, query: 'карелия', modes: ['assault'], camouflages: [] })).toEqual([]);
  });
});

describe('normalizeMapName', () => {
  it('treats ё and е as the same letter', () => {
    expect(normalizeMapName('Берёзовая')).toBe(normalizeMapName('березовая'));
  });
});

describe('mapSizeClass', () => {
  it('puts the bounds themselves into the outer classes', () => {
    expect(mapSizeClass(MAP_SIZE_BOUNDS.smallMax)).toBe('small');
    expect(mapSizeClass(MAP_SIZE_BOUNDS.largeMin)).toBe('large');
    expect(mapSizeClass(MAP_SIZE_BOUNDS.smallMax + 1)).toBe('medium');
  });

  it('leaves a map of unknown size unclassified', () => {
    expect(mapSizeClass(null)).toBeNull();
  });
});

describe('filterMaps by size and pins', () => {
  it('drops maps outside the chosen size classes', () => {
    expect(filterMaps({ ...ALL, sizes: ['large'] })).toEqual([]);
    expect(filterMaps({ ...ALL, sizes: ['medium'] })).toHaveLength(MAPS.length);
  });

  it('keeps only pinned maps when the pin filter is on', () => {
    expect(ids(filterMaps({ ...ALL, pinnedIds: ['28_desert'] }))).toEqual(['28_desert']);
  });
});
