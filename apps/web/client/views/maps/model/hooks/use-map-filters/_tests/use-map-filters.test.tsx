import { act, renderHook } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it, vi } from 'vitest';

import { useMapFilters } from '../use-map-filters';

const renderFilters = (searchParams: string) => {
  const onUrlUpdate = vi.fn();
  const view = renderHook(() => useMapFilters(), { wrapper: withNuqsTestingAdapter({ searchParams, onUrlUpdate }) });

  return { ...view, onUrlUpdate };
};

describe('useMapFilters', () => {
  it('reads empty filters by default', () => {
    const { result } = renderFilters('');

    expect(result.current).toMatchObject({ filters: { q: '', modes: [], camo: [] }, isFiltered: false });
  });

  it('reads filters from the URL', () => {
    const { result } = renderFilters('?q=ens&modes=assault');

    expect(result.current).toMatchObject({ filters: { q: 'ens', modes: ['assault'], camo: [] }, isFiltered: true });
  });

  it('writes the search and clears everything on reset', async () => {
    const { result, onUrlUpdate } = renderFilters('?modes=assault');

    await act(async () => result.current.onQueryChange('prokh'));

    expect(result.current.filters.q).toBe('prokh');

    await act(async () => result.current.onReset());

    expect(result.current.isFiltered).toBe(false);
    expect(onUrlUpdate).toHaveBeenLastCalledWith(expect.objectContaining({ queryString: '' }));
  });
});
