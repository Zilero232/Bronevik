import { renderHook } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it, vi } from 'vitest';

import { useShowcaseSource } from '../use-showcase-source';

const plus = vi.hoisted(() => ({ isPlus: false }));

vi.mock('@/features/plus/plus-gate', () => ({ usePlus: () => plus }));

const renderSource = ({ search, isPlus }: { search: string; isPlus: boolean }) => {
  plus.isPlus = isPlus;

  return renderHook(() => useShowcaseSource(), { wrapper: withNuqsTestingAdapter({ searchParams: search }) });
};

describe('useShowcaseSource', () => {
  it('defaults to the top 10 percent', () => {
    const { result } = renderSource({ search: '', isPlus: false });

    expect(result.current).toMatchObject({ source: 'top10', other: 'all', isShares: false });
  });

  it('falls back to the default source when the Plus source is locked', () => {
    const { result } = renderSource({ search: '?source=top1', isPlus: false });

    expect(result.current.source).toBe('top10');
  });

  it('opens the Plus source for a subscriber', () => {
    const { result } = renderSource({ search: '?source=top1', isPlus: true });

    expect(result.current).toMatchObject({ source: 'top1', other: 'all' });
  });

  it('shows shares for the whole server', () => {
    const { result } = renderSource({ search: '?source=all', isPlus: false });

    expect(result.current).toMatchObject({ source: 'all', other: 'top10', isShares: true });
  });
});
