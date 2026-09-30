import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { UiComponent } from '../../../../../shared/api/protocol';

import { GAMEFACE } from '../../../../../shared/api/gameface';
import { createGamefaceMock, installGamefaceMock } from '../../../../../shared/api/gameface/mock';
import { parseState } from '../../../../../shared/api/protocol';
import { $undo } from '../../store';
import { changeSetting, resetComponent, toggleSwitch, undoLast } from '../actions';

const sample = readFileSync(path.resolve(import.meta.dirname, '../../../../../shared/api/protocol/_tests/fixtures/state.sample.json'), 'utf8');

const component = (id: string): UiComponent => {
  const found = parseState(sample)?.components.find((item) => item.id === id);

  if (!found) {
    throw new Error(id);
  }

  return found;
};

const install = () => {
  const mock = createGamefaceMock({ state: sample, clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  installGamefaceMock(mock);

  return () => mock.sent().map((message) => JSON.parse(message));
};

beforeEach(() => {
  $undo.set([]);
});

afterEach(() => {
  Object.values(GAMEFACE.globals).forEach((name) => Reflect.deleteProperty(globalThis, name));
});

describe('setting actions', () => {
  it('applies a change at once and undoes it with the previous value', () => {
    const sent = install();

    changeSetting({ component: component('companion'), key: 'flush_interval_seconds', value: 30 });
    toggleSwitch(component('marks_panel'));

    expect($undo.get().map(({ kind, component: id, label, switchedOn, values }) => [kind, id, label, switchedOn, values])).toEqual([
      ['field', 'companion', 'Интервал отправки, с', false, { flush_interval_seconds: 15 }],
      ['switch', 'marks_panel', 'Отметка в бою', false, { battle_moe_panel: true }]
    ]);

    undoLast();
    undoLast();
    undoLast();

    expect(sent()).toEqual([
      { type: 'set', component: 'companion', key: 'flush_interval_seconds', value: 30 },
      { type: 'set', component: 'marks_panel', key: 'battle_moe_panel', value: false },
      { type: 'set', component: 'marks_panel', key: 'battle_moe_panel', value: true },
      { type: 'set', component: 'companion', key: 'flush_interval_seconds', value: 15 }
    ]);

    expect($undo.get()).toEqual([]);
  });

  it('skips a change to the same value', () => {
    const sent = install();

    changeSetting({ component: component('companion'), key: 'flush_interval_seconds', value: 15 });

    expect(sent()).toEqual([]);
    expect($undo.get()).toEqual([]);
  });

  it('resets a card to its defaults in one message and undoes the reset in one', () => {
    const sent = install();
    const damage = component('damage_log');
    const changed = {
      ...damage,
      fields: damage.fields.map((field) => {
        if (field.type === 'int' && field.key === 'lines') {
          return { ...field, value: 9 };
        }

        return field.type === 'bool' ? { ...field, value: true } : field;
      })
    };

    resetComponent(damage);
    resetComponent(changed);
    undoLast();

    expect(sent()).toEqual([
      { type: 'set_many', component: 'damage_log', values: { border: false, lines: 5 } },
      { type: 'set_many', component: 'damage_log', values: { border: true, lines: 9 } }
    ]);
  });
});
