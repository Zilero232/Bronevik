import { describe, expect, it } from 'vitest';

import type { AchievementCatalogRow } from '../achievements.types';

import { achievementImages, playerAchievements } from '../achievements';

const BIG = 'https://static.example/wot/encyclopedia/achievement/big/warrior.png';
const SMALL = 'https://static.example/wot/encyclopedia/achievement/warrior.png';

const row = (name: string, order: number | null): AchievementCatalogRow => ({
  name,
  section: 'battle',
  title: name.toUpperCase(),
  description: null,
  image: BIG,
  order
});

describe('achievementImages', () => {
  it('derives both sizes from the stored big image', () => {
    expect(achievementImages(BIG)).toEqual({ image: SMALL, imageBig: BIG });
  });

  it('derives both sizes from a stored small image', () => {
    expect(achievementImages(SMALL)).toEqual({ image: SMALL, imageBig: BIG });
  });

  it('returns no images when none is stored', () => {
    expect(achievementImages(null)).toEqual({ image: null, imageBig: null });
  });
});

describe('playerAchievements', () => {
  it('keeps only earned achievements, in catalog order', () => {
    const items = playerAchievements({
      counts: { b: 2, a: 1, c: 0 },
      maxSeries: null,
      catalog: [row('a', 2), row('b', 1), row('c', 0)]
    });

    expect(items.map(({ name }) => name)).toEqual(['b', 'a']);
  });

  it('attaches the max series of the same achievement and null otherwise', () => {
    const items = playerAchievements({ counts: { a: 3, b: 1 }, maxSeries: { a: 7 }, catalog: [row('a', 1), row('b', 2)] });

    expect(items.map(({ maxSeries }) => maxSeries)).toEqual([7, null]);
  });

  it('puts an achievement missing from the catalog last, under its raw name', () => {
    const items = playerAchievements({ counts: { unknown: 1, a: 1 }, maxSeries: undefined, catalog: [row('a', 5)] });

    expect(items.at(-1)).toMatchObject({ name: 'unknown', title: 'unknown', section: null, image: null });
  });
});
