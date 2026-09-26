import type { PlayerAchievement } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { ACHIEVEMENTS } from '../../../config';
import { achievementSections, knownSection } from '../achievement-sections';

const medal = ({ section, name, count }: Pick<PlayerAchievement, 'count' | 'name' | 'section'>): PlayerAchievement => ({
  section,
  name,
  title: name,
  description: null,
  image: null,
  imageBig: null,
  count,
  maxSeries: null
});

const ITEMS = [
  medal({ section: 'epic', name: 'a', count: 1 }),
  medal({ section: 'battle', name: 'b', count: 4 }),
  medal({ section: 'epic', name: 'c', count: 2 }),
  medal({ section: 'battle', name: 'd', count: 0 })
];

describe('achievementSections', () => {
  it('groups medals by section in the order the API lists them', () => {
    expect(achievementSections(ITEMS).map(({ section }) => section)).toEqual(['epic', 'battle']);
  });

  it('keeps every earned medal exactly once', () => {
    const names = achievementSections(ITEMS).flatMap(({ items }) => items.map(({ name }) => name));

    expect(names.sort()).toEqual(['a', 'b', 'c']);
  });

  it('files a medal without a section under the fallback section', () => {
    expect(achievementSections([medal({ section: null, name: 'x', count: 1 })])[0].section).toBe(ACHIEVEMENTS.fallbackSection);
  });

  it('leaves out medals the player has not earned', () => {
    expect(achievementSections([medal({ section: 'epic', name: 'x', count: 0 })])).toEqual([]);
  });
});

describe('knownSection', () => {
  it('recognises every section the tab has a heading for', () => {
    ACHIEVEMENTS.sections.forEach((section) => expect(knownSection(section)).toBe(section));
  });

  it('returns null for a section the API adds later', () => {
    expect(knownSection('brand-new')).toBeNull();
  });
});
