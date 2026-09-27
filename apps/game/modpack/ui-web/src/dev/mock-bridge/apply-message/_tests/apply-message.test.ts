import { describe, expect, it } from 'vitest';

import { parseState } from '../../../../settings/model/protocol';
import sample from '../../../../settings/model/protocol/_tests/fixtures/state.sample.json';
import { applyMessage } from '../apply-message';

const parsed = parseState(JSON.stringify(sample));

if (!parsed) {
  throw new Error('state fixture does not parse');
}

const state = parsed;

describe('applyMessage (dev mock bridge)', () => {
  it('writes a set message into the field and bumps the revision', () => {
    const component = state.components[0];
    const field = component?.fields.find((candidate) => candidate.type === 'bool');

    expect(component && field).toBeTruthy();

    const next = applyMessage({ state, message: { type: 'set', component: component?.id ?? '', key: field?.key ?? '', value: !field?.value } });

    expect(next.revision).toBe(state.revision + 1);
    expect(next.components[0]?.fields.find((candidate) => candidate.key === field?.key)?.value).toBe(!field?.value);
  });

  it('switches the language and reports other messages as a notice', () => {
    expect(applyMessage({ state, message: { type: 'language', language: 'en' } }).language).toBe('en');
    expect(applyMessage({ state, message: { type: 'close' } }).notice).toEqual({ kind: 'info', text: 'mock bridge: close', code: null });
  });
});
