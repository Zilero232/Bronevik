import { afterEach, describe, expect, it, vi } from 'vitest';

import { createStoredStore } from '../stored-store';

const KEY = 'test-stored-store';

const numbers = () =>
  createStoredStore<number[]>({ key: KEY, parse: (value) => (Array.isArray(value) ? value.filter((item) => typeof item === 'number') : []) });

afterEach(() => {
  window.localStorage.clear();
});

describe('createStoredStore', () => {
  it('parses the stored JSON and keeps one snapshot until it changes', () => {
    window.localStorage.setItem(KEY, JSON.stringify([1, 'x', 2]));

    const store = numbers();
    const first = store.read();

    expect(first).toEqual([1, 2]);
    expect(store.read()).toBe(first);

    window.localStorage.setItem(KEY, JSON.stringify([3]));

    expect(store.read()).toEqual([3]);
  });

  it('treats broken JSON as an empty value', () => {
    window.localStorage.setItem(KEY, '{broken');

    expect(numbers().read()).toEqual([]);
  });

  it('writes, updates and removes the value and notifies subscribers', () => {
    const store = numbers();
    const onChange = vi.fn();
    const unsubscribe = store.subscribe(onChange);

    store.write([1]);
    store.update((current) => [...current, 2]);

    expect(store.read()).toEqual([1, 2]);
    expect(onChange).toHaveBeenCalledTimes(2);

    store.write(null);

    expect(window.localStorage.getItem(KEY)).toBeNull();
    expect(store.read()).toEqual([]);

    unsubscribe();
    store.write([5]);

    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('follows writes from other tabs through the storage event', () => {
    const store = numbers();
    const onChange = vi.fn();

    store.subscribe(onChange);
    window.dispatchEvent(new StorageEvent('storage', { key: 'another-key' }));
    window.dispatchEvent(new StorageEvent('storage', { key: KEY }));

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
