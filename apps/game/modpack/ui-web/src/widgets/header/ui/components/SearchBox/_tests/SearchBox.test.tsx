// @vitest-environment jsdom
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import { stepBack } from '../../../../../../shared/lib/escape-stack';
import { SearchBox } from '../SearchBox';

const container = document.createElement('div');

const mountSearch = (query: string, cleared: string[] = []): HTMLInputElement => {
  document.body.append(container);

  void act(() => {
    render(h(SearchBox, { query, onChange: () => undefined, onClear: () => cleared.push(query) }), container);
  });

  const input = container.querySelector('input');

  if (!input) {
    throw new Error('the search box has no input');
  }

  return input;
};

const pressCtrlF = (): void => {
  void act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', keyCode: 70, ctrlKey: true, cancelable: true }));
  });
};

const pressEsc = (): void => {
  act(() => {
    stepBack();
  });
};

afterEach(() => {
  void act(() => {
    render(null, container);
  });

  container.remove();
});

describe(SearchBox, () => {
  it('takes the focus on Ctrl+F', () => {
    const input = mountSearch('');

    pressCtrlF();

    expect(document.activeElement).toBe(input);
  });

  it('clears a typed query on the first Esc', () => {
    const cleared: string[] = [];

    mountSearch('camo', cleared);
    pressCtrlF();

    pressEsc();

    expect(cleared).toEqual(['camo']);
  });

  it('gives the focus back on Esc once the query is empty', () => {
    const input = mountSearch('');

    pressCtrlF();

    pressEsc();

    expect(document.activeElement).not.toBe(input);
  });
});
