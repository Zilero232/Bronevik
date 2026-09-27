import { describe, expect, it } from 'vitest';

import { toggleValue } from '..';

const VALUES = ['site', 'telegram'] as const;

describe('toggleValue', () => {
  it('adds a value that is switched on', () => {
    expect(toggleValue<string>({ values: VALUES, value: 'email', isOn: true })).toEqual([...VALUES, 'email']);
  });

  it('removes a value that is switched off', () => {
    expect(toggleValue<string>({ values: VALUES, value: 'site', isOn: false })).toEqual(['telegram']);
  });

  it('never duplicates a value switched on twice', () => {
    expect(toggleValue<string>({ values: VALUES, value: 'site', isOn: true }).filter((item) => item === 'site')).toHaveLength(1);
  });
});
