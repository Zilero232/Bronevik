import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { useLocationHash } from '..';

const setHash = (hash: string) => {
  window.history.replaceState(null, '', hash ? `#${hash}` : window.location.pathname);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};

describe('useLocationHash', () => {
  afterEach(() => setHash(''));

  it('renders nothing on the server, where the fragment is never sent', () => {
    const Probe = () => String(useLocationHash());

    expect(renderToString(createElement(Probe))).toBe('null');
  });

  it('reads the fragment without the hash sign and without decoding it', () => {
    setHash('TM1.a%20b');

    const { result } = renderHook(() => useLocationHash());

    expect(result.current).toBe('TM1.a%20b');
  });

  it('reads an empty string when the address has no fragment', () => {
    const { result } = renderHook(() => useLocationHash());

    expect(result.current).toBe('');
  });

  it('follows a later change of the fragment', () => {
    const { result } = renderHook(() => useLocationHash());

    act(() => setHash('TM1.next'));

    expect(result.current).toBe('TM1.next');
  });
});
