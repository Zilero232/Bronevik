import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { parseHudState } from '../hud-protocol';
import { HUD_PROTOCOL } from '../hud-protocol.constants';
import { hudMessageSchema } from '../hud-protocol.schemas';

const sample = readFileSync(path.resolve(import.meta.dirname, 'fixtures/hud-state.sample.json'), 'utf8');

describe(parseHudState, () => {
  it('accepts the state core/hud/surface builds (fixture written by packages/core/tests/test_hud_backends)', () => {
    const state = parseHudState(sample);

    expect(state?.cursor).toBe(true);
    expect(state?.panels.map(({ id }) => id)).toEqual(['otmetki.hud.damage_log']);
    expect(state?.panels[0]).toMatchObject({ align_x: 'left', align_y: 'bottom', drag: true });
  });

  it('refuses text that is not the protocol', () => {
    expect(parseHudState('not json')).toBeNull();
    expect(parseHudState(JSON.stringify({ ...JSON.parse(sample), v: 99 }))).toBeNull();
  });
});

describe('HUD messages', () => {
  it('has one schema per protocol command', () => {
    const types = hudMessageSchema._zod.def.options.map((option) => option._zod.def.shape.type._zod.def.values[0]);

    expect(types).toEqual([...HUD_PROTOCOL.commands]);
  });

  it('validates a move with its anchor', () => {
    expect(hudMessageSchema.safeParse({ type: 'moved', id: 'a', x: 1, y: 2, align_x: 'right', align_y: 'top' }).success).toBe(true);
    expect(hudMessageSchema.safeParse({ type: 'moved', id: 'a', x: 1, y: 2, align_x: 'middle', align_y: 'top' }).success).toBe(false);
  });
});
