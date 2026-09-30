import { describe, expect, it } from 'vitest';

import { parseState } from '../../../../../shared/api/protocol';
import sample from '../../../../../shared/api/protocol/_tests/fixtures/state.sample.json';
import { DEV_MOCK } from '../../../config';
import { applyMessage } from '../apply-message';

const parsed = parseState(JSON.stringify(sample));

if (!parsed) {
  throw new Error('state fixture does not parse');
}

const state = parsed;

describe(applyMessage, () => {
  it('writes a set message into the field and bumps the revision', () => {
    const component = state.components[0];
    const field = component?.fields.find((candidate) => candidate.type === 'bool');

    expect(component && field).toBeTruthy();

    const next = applyMessage({ state, message: { type: 'set', component: component?.id ?? '', key: field?.key ?? '', value: !field?.value } });

    expect(next.revision).toBe(state.revision + 1);
    expect(next.components[0]?.fields.find((candidate) => candidate.key === field?.key)?.value).toBe(!field?.value);
  });

  it('applies a whole reset and keeps the window where it was left', () => {
    const next = applyMessage({ state, message: { type: 'set_many', component: 'damage_log', values: { lines: 9, border: true } } });
    const fields = next.components.find(({ id }) => id === 'damage_log')?.fields ?? [];

    expect(fields.filter(({ key }) => key === 'lines' || key === 'border').map(({ value }) => value)).toEqual([true, 9]);

    expect(applyMessage({ state, message: { type: 'window_layout', x: 1, y: 2, width: 900, height: 600, zoom: 110 } }).window).toEqual({
      placed: true,
      x: 1,
      y: 2,
      width: 900,
      height: 600,
      zoom: 110
    });
  });

  it('switches the language and reports other messages as a notice', () => {
    expect(applyMessage({ state, message: { type: 'language', language: 'en' } }).language).toBe('en');
    expect(applyMessage({ state, message: { type: 'close' } }).notice).toEqual({ kind: 'info', text: `${DEV_MOCK.noticePrefix} close`, code: null });
  });
});
