import type { MapSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { MAP_MODE_PREFIXES } from '@/entities/map/map';

import { GUESS_MAP } from '../../../config';
import { fragmentZoom, mapGameStatus, mapPool, pickDailyMap } from '../daily-map';

const map = (arenaId: string, patch: Partial<MapSummary> = {}): MapSummary => ({
  arenaId,
  slug: arenaId,
  name: arenaId,
  nameEn: null,
  image: `https://raw.githubusercontent.com/unicum-gg/wot.maps/Lesta/maps/${arenaId}.webp`,
  sizeMeters: 1000,
  camouflage: 'summer',
  modes: [MAP_MODE_PREFIXES.standard],
  ...patch
});

const MAPS = Array.from({ length: 30 }, (_, index) => map(`${String(index).padStart(2, '0')}_map`));

const DAYS = Array.from({ length: 20 }, (_, index) => `2026-10-${String(index + 1).padStart(2, '0')}`);

describe('mapPool', () => {
  it('keeps only random-battle maps that have a minimap image', () => {
    const pool = mapPool([map('a'), map('b', { image: null }), map('c', { modes: [MAP_MODE_PREFIXES.onslaught] })]);

    expect(pool.map(({ arenaId }) => arenaId)).toEqual(['a']);
  });
});

describe('pickDailyMap', () => {
  it('gives every player the same map and fragment on the same day, whatever the list order', () => {
    expect(pickDailyMap({ maps: MAPS, day: '2026-10-01' })).toEqual(pickDailyMap({ maps: [...MAPS].reverse(), day: '2026-10-01' }));
  });

  it('changes the map from day to day', () => {
    const picks = new Set(DAYS.map((day) => pickDailyMap({ maps: MAPS, day })?.map.arenaId));

    expect(picks.size).toBeGreaterThan(DAYS.length / 3);
  });

  it('centres the fragment inside the configured range so the zoomed view never leaves the image', () => {
    DAYS.forEach((day) => {
      const focus = pickDailyMap({ maps: MAPS, day })?.focus;

      [focus?.x, focus?.y].forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(GUESS_MAP.focusRange.min);
        expect(value).toBeLessThanOrEqual(GUESS_MAP.focusRange.max);
      });
    });
  });

  it('returns nothing when no map has an image', () => {
    expect(pickDailyMap({ maps: [map('a', { image: null })], day: '2026-10-01' })).toBeNull();
  });
});

describe('mapGameStatus', () => {
  it('is won as soon as the target is guessed', () => {
    expect(mapGameStatus({ guessIds: ['a', 'b'], targetId: 'b' })).toBe('won');
  });

  it('is lost once every guess is spent on other maps', () => {
    const misses = Array.from({ length: GUESS_MAP.maxGuesses }, (_, index) => `miss-${index}`);

    expect(mapGameStatus({ guessIds: misses, targetId: 'target' })).toBe('lost');
    expect(mapGameStatus({ guessIds: misses.slice(1), targetId: 'target' })).toBe('playing');
  });
});

describe('fragmentZoom', () => {
  it('zooms out with every miss', () => {
    const zooms = Array.from({ length: GUESS_MAP.maxGuesses }, (_, misses) => fragmentZoom({ misses, isOver: false }));

    zooms.slice(1).forEach((zoom, index) => expect(zoom).toBeLessThan(zooms[index] ?? 0));
  });

  it('never zooms past the last step and shows the whole map when the game is over', () => {
    expect(fragmentZoom({ misses: GUESS_MAP.maxGuesses * 2, isOver: false })).toBe(GUESS_MAP.zoomSteps.at(-1));
    expect(fragmentZoom({ misses: 0, isOver: true })).toBe(1);
  });
});
