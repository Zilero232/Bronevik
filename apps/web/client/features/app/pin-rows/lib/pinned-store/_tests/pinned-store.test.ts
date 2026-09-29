import { afterEach, describe, expect, it, vi } from 'vitest';

import { PIN_SCOPES } from '../../../config';
import { readPinned, subscribePinned, togglePinned } from '../pinned-store';

afterEach(() => {
  window.localStorage.clear();
});

describe('readPinned', () => {
  it('returns the same array until the stored value changes', () => {
    window.localStorage.setItem(PIN_SCOPES.tanks, JSON.stringify(['1', '2']));

    const first = readPinned('tanks');

    expect(readPinned('tanks')).toBe(first);

    window.localStorage.setItem(PIN_SCOPES.tanks, JSON.stringify(['3']));

    expect(readPinned('tanks')).toEqual(['3']);
  });

  it('treats a value that is not JSON as nothing pinned', () => {
    window.localStorage.setItem(PIN_SCOPES.maps, '{broken');

    expect(readPinned('maps')).toEqual([]);
  });
});

describe('togglePinned', () => {
  it('writes the toggled ids and notifies every subscriber once', () => {
    const onChange = vi.fn();
    const unsubscribe = subscribePinned(onChange);

    togglePinned({ scope: 'maps', id: 'himmelsdorf' });

    expect(readPinned('maps')).toEqual(['himmelsdorf']);
    expect(onChange).toHaveBeenCalledTimes(1);

    unsubscribe();
    togglePinned({ scope: 'maps', id: 'himmelsdorf' });

    expect(readPinned('maps')).toEqual([]);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('keeps the scopes apart', () => {
    togglePinned({ scope: 'tanks', id: '1' });

    expect(readPinned('maps')).toEqual([]);
  });
});
