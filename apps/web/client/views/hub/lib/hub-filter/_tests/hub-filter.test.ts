import { Users } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { filterHubSections } from '../hub-filter';

const link = (key: string, label: string, hint: string) => ({ key, href: `/${key}`, icon: Users, label, hint });

const SECTIONS = [
  { key: 'players', title: 'Игроки', items: [link('players', 'Поиск игроков', 'Статистика по нику'), link('top', 'Топы', 'Лучшие по WN8')] },
  { key: 'vehicles', title: 'Танки', items: [link('marks', 'Отметки и мастер', 'Урон на отметки'), link('tree', 'Дерево развития', 'Ветки')] }
];

describe('filterHubSections', () => {
  it('returns every section for an empty query', () => {
    expect(filterHubSections({ sections: SECTIONS, query: '  ' })).toEqual(SECTIONS);
  });

  it('keeps only the links whose label or hint matches, ignoring case and ё', () => {
    const result = filterHubSections({ sections: SECTIONS, query: 'ОТМЕТК' });

    expect(result.map(({ key }) => key)).toEqual(['vehicles']);
    expect(result[0]?.items.map(({ key }) => key)).toEqual(['marks']);
  });

  it('keeps a whole section when its title matches', () => {
    expect(filterHubSections({ sections: SECTIONS, query: 'игроки' })[0]?.items).toHaveLength(2);
  });

  it('returns nothing when no link matches', () => {
    expect(filterHubSections({ sections: SECTIONS, query: 'zzz' })).toEqual([]);
  });
});
