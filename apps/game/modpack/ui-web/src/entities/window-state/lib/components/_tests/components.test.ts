import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import type { UiComponent } from '../../../../../shared/api/protocol';

import { parseState } from '../../../../../shared/api/protocol';
import {
  changedFields,
  componentIcon,
  componentsOf,
  currentValues,
  defaultValues,
  labelOf,
  searchComponents,
  summarize,
  valueOf
} from '../components';

const sample = readFileSync(path.resolve(import.meta.dirname, '../../../../../shared/api/protocol/_tests/fixtures/state.sample.json'), 'utf8');

const components = (): UiComponent[] => parseState(sample)?.components ?? [];

const byId = (id: string): UiComponent => {
  const found = components().find((component) => component.id === id);

  if (!found) {
    throw new Error(id);
  }

  return found;
};

describe(componentsOf, () => {
  it('keeps a page to its own cards, sorted by title, and filters them by where they show', () => {
    const all = components();

    const titles = componentsOf({ components: all, section: 'battle', context: 'all' }).map(({ title }) => title);

    expect(titles).toHaveLength(2);
    expect(titles).toEqual([...titles].sort((left, right) => left.localeCompare(right)));
    expect(componentsOf({ components: all, section: 'marks', context: 'hangar' }).map(({ id }) => id)).toEqual(['session_stats']);
    expect(componentsOf({ components: all, section: 'marks', context: 'battle' }).map(({ id }) => id)).toEqual(['marks_panel']);
    expect(componentsOf({ components: all, section: 'data', context: 'battle' }).map(({ id }) => id)).toEqual(['companion']);
  });
});

describe(summarize, () => {
  it('counts every page in the navigation order, switched-off cards apart', () => {
    const summaries = summarize(components());

    expect(summaries.map(({ section }) => section)).toEqual(['battle', 'hangar', 'marks', 'replays', 'streamer', 'data']);
    expect(summaries.find(({ section }) => section === 'battle')).toEqual({ section: 'battle', total: 2, enabled: 1 });
    expect(summaries.find(({ section }) => section === 'replays')).toEqual({ section: 'replays', total: 1, enabled: 1 });
  });
});

describe(searchComponents, () => {
  it('finds a card by its title and shows all of its settings', () => {
    const [hit] = searchComponents({ components: components(), query: 'СЕССИЯ' });

    expect(hit?.component.id).toBe('session_stats');
    expect(hit?.fields).toHaveLength(1);
  });

  it('finds single settings by label and choice, ignoring case and ё', () => {
    const hits = searchComponents({ components: components(), query: 'интервал' });

    expect(hits.map(({ component, fields }) => [component.id, fields.map(({ key }) => key)])).toEqual([['companion', ['flush_interval_seconds']]]);
    expect(searchComponents({ components: components(), query: 'ctrl+alt' })[0]?.fields.map(({ key }) => key)).toEqual(['hud_modifier']);
  });

  it('waits for two letters', () => {
    expect(searchComponents({ components: components(), query: ' о ' })).toEqual([]);
  });
});

describe('defaults and undo values', () => {
  it('lists what differs from the defaults, and both sides of a reset', () => {
    const minimap = {
      ...byId('minimap'),
      fields: byId('minimap').fields.map((field) => (field.type === 'choice' ? { ...field, value: 'x2' } : field))
    };

    expect(changedFields(byId('damage_log'))).toEqual([]);
    expect(changedFields(minimap).map(({ key }) => key)).toEqual(['zoom']);
    expect(defaultValues(minimap)).toEqual({ zoom: 'native' });
    expect(currentValues(minimap)).toEqual({ zoom: 'x2' });
  });

  it('reads a switch or a field by key', () => {
    const companion = byId('companion');

    expect(valueOf({ component: companion, key: 'enabled' })).toBe(true);
    expect(valueOf({ component: companion, key: 'flush_interval_seconds' })).toBe(15);
    expect(valueOf({ component: companion, key: 'missing' })).toBeNull();
    expect(labelOf({ component: companion, key: 'enabled' })).toBe(companion.title);
  });

  it('draws a known card with its own icon and a new one with the fallback', () => {
    expect(componentIcon('damage_log')).toBe('scroll-text');
    expect(componentIcon('brand_new')).toBe('puzzle');
  });
});
