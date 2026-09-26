import { renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { useHydrated } from '..';

describe('useHydrated', () => {
  it('reports false while rendering on the server', () => {
    const Probe = () => String(useHydrated());

    expect(renderToString(createElement(Probe))).toBe('false');
  });

  it('reports true once rendered on the client', () => {
    const { result } = renderHook(() => useHydrated());

    expect(result.current).toBe(true);
  });
});
