import { describe, expect, it } from 'vitest';

import { fontSafeState } from '..';
import { parseState } from '../../../../../shared/api/protocol';
import sample from '../../../../../shared/api/protocol/_tests/fixtures/state.sample.json';

const base = () => {
  const state = parseState(JSON.stringify(sample));

  if (!state) {
    throw new Error('the state fixture does not parse');
  }

  return state;
};

describe(fontSafeState, () => {
  it('draws the glyphs the client font lacks with ones it has, in every display text', () => {
    const state = base();
    const [first, ...rest] = state.components;

    if (!first) {
      throw new Error('the state fixture has no component');
    }

    const safe = fontSafeState({
      ...state,
      components: [{ ...first, hint: 'Оборудование (★ — в слоте со своим бонусом) → панель', title: 'Мод ✓' }, ...rest]
    });

    expect(safe.components[0]?.hint).toBe('Оборудование (* — в слоте со своим бонусом) › панель');
    expect(safe.components[0]?.title).toBe('Мод +');
  });

  it('leaves the ids and values the page sends back as they are', () => {
    const state = base();
    const [first, ...rest] = state.components;

    if (!first) {
      throw new Error('the state fixture has no component');
    }

    const field = { key: 'format★', label: 'Формат →', hint: null, type: 'text' as const, value: '{damage} →', default: '→', max_length: 40 };
    const safe = fontSafeState({ ...state, components: [{ ...first, id: 'id★', fields: [field] }, ...rest] });

    expect(safe.components[0]?.id).toBe('id★');
    expect(safe.components[0]?.fields[0]).toEqual({ ...field, label: 'Формат ›' });
    expect(safe.revision).toBe(state.revision);
  });
});
