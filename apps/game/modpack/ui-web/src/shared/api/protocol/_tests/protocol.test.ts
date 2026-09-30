import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { parseState } from '../protocol';
import { PROTOCOL } from '../protocol.constants';
import { messageSchema } from '../protocol.schemas';

const sample = readFileSync(path.resolve(import.meta.dirname, 'fixtures/state.sample.json'), 'utf8');

describe('parseState', () => {
  it('accepts the state the Python bridge builds (fixture written by packages/ui/tests)', () => {
    const state = parseState(sample);

    expect(state?.components.map(({ id }) => id)).toEqual([
      'companion',
      'marks_panel',
      'session_stats',
      'minimap',
      'replay_manager',
      'damage_log',
      'hud_layouts'
    ]);

    expect(state?.hud.panels[0]).toMatchObject({ id: 'damage_log', preview: '1 200' });
    expect(state?.profiles.active).toBe('p1');
  });

  it('refuses text that is not the protocol', () => {
    expect(parseState('not json')).toBeNull();
    expect(parseState('{"v": 2}')).toBeNull();
    expect(parseState(JSON.stringify({ ...JSON.parse(sample), v: 99 }))).toBeNull();
  });
});

describe('messages', () => {
  it('has one schema per protocol command', () => {
    const types = messageSchema._zod.def.options.map((option) => option._zod.def.shape.type._zod.def.values[0]);

    expect(types).toEqual([...PROTOCOL.commands]);
  });

  it('validates a HUD move with its alignment', () => {
    expect(messageSchema.safeParse({ type: 'hud_move', panel: 'damage_log', x: 1, y: 2, align_x: 'right' }).success).toBe(true);
    expect(messageSchema.safeParse({ type: 'hud_move', panel: 'damage_log', x: 1, y: 2, align_x: 'middle' }).success).toBe(false);
  });
});
