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

const openDropdown = (chosen: string[]): HTMLElement => {
  const container = mount({
    Component: Dropdown<string>,
    props: { label: 'Sort', value: 'date', options: OPTIONS, onSelect: (value: string) => chosen.push(value) }
  });

  act(() => container.querySelector('button')?.click());

  return container;
};

const pressEsc = (): void => {
  act(() => {
    stepBack();
  });
};

describe(Dropdown, () => {
  it('closes its open list on Esc', () => {
    const container = openDropdown([]);

    pressEsc();

    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it('keeps the value when Esc closes the list', () => {
    const chosen: string[] = [];

    openDropdown(chosen);

    pressEsc();

    expect(chosen).toEqual([]);
  });
});
