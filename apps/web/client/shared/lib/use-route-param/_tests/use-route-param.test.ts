import { renderHook } from '@testing-library/react';
import { useParams } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import { useRouteParam } from '../use-route-param';

vi.mock('next/navigation', () => ({ useParams: vi.fn() }));

describe('useRouteParam', () => {
  it('decodes an encoded segment such as a Cyrillic nickname', () => {
    vi.mocked(useParams).mockReturnValue({ nickname: encodeURIComponent('Танкист') });

    expect(renderHook(() => useRouteParam('nickname')).result.current).toBe('Танкист');
  });

  it('returns an empty string for a param the route does not have', () => {
    vi.mocked(useParams).mockReturnValue({});

    expect(renderHook(() => useRouteParam('nickname')).result.current).toBe('');
  });

  it('keeps a malformed escape as it came instead of throwing', () => {
    vi.mocked(useParams).mockReturnValue({ nickname: '100%' });

    expect(renderHook(() => useRouteParam('nickname')).result.current).toBe('100%');
  });
});
