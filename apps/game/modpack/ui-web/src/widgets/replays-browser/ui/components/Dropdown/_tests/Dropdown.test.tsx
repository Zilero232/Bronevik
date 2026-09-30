// @vitest-environment jsdom
import { act } from 'preact/test-utils';
import { describe, expect, it } from 'vitest';

import { stepBack } from '../../../../../../shared/lib/escape-stack';
import { mount } from '../../../../../../shared/lib/testing/mount';
import { Dropdown } from '../Dropdown';

const OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'damage', label: 'Damage' }
];

describe(Dropdown, () => {
  it('closes its open list on Esc and keeps the value', () => {
    const chosen: string[] = [];
    const container = mount({
      Component: Dropdown<string>,
      props: { label: 'Sort', value: 'date', options: OPTIONS, onSelect: (value: string) => chosen.push(value) }
    });

    act(() => container.querySelector('button')?.click());

    act(() => {
      stepBack();
    });

    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(chosen).toEqual([]);
  });
});
