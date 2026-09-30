import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { parseHudState } from '../../../../../shared/api/hud-protocol';
import { clearedRecord, remember, sharePanels } from '../share-panels';

const raw = readFileSync(path.resolve(import.meta.dirname, '../../../../../shared/api/hud-protocol/_tests/fixtures/hud-state.sample.json'), 'utf8');

const parse = (text: string) => {
  const state = parseHudState(text);

  if (!state) {
    throw new Error('the HUD fixture does not parse');
  }

  return state;
};

describe(sharePanels, () => {
  it('keeps the previous state when nothing changed and the previous panel objects that did not change', () => {
    const previous = parse(raw);

    expect(sharePanels({ previous, next: parse(raw) })).toBe(previous);
    expect(sharePanels({ previous: null, next: previous })).toBe(previous);

    const data = parse(raw);
    const changed = { ...data, panels: data.panels.map((panel, index) => (index === 0 ? { ...panel, text: 'changed' } : panel)) };
    const next = sharePanels({ previous, next: parse(JSON.stringify(changed)) });

    expect(next).not.toBe(previous);
    expect(next.panels[0]?.text).toBe('changed');
    expect(next.panels.slice(1).every((panel, index) => panel === previous.panels[index + 1])).toBe(true);
  });

  it('builds a value once per panel object and clears a record only when it holds something', () => {
    const cache = new WeakMap<object, number>();
    const [panel] = parse(raw).panels;
    let builds = 0;

    if (!panel) {
      throw new Error('the HUD fixture has no panels');
    }

    const build = () => {
      builds += 1;

      return builds;
    };

    expect(remember({ cache, panel, build })).toBe(1);
    expect(remember({ cache, panel, build })).toBe(1);

    const empty = {};

    expect(clearedRecord(empty)).toBe(empty);
    expect(clearedRecord({ a: 1 })).toEqual({});
  });
});
