import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { useMapFilters } from '../use-map-filters';

const renderFilters = (searchParams: string) => {
  const onUrlUpdate = vi.fn();
  const Nuqs = withNuqsTestingAdapter({ searchParams, onUrlUpdate });
  const view = renderHook(() => useMapFilters(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
        <Nuqs>{children}</Nuqs>
      </NextIntlClientProvider>
    )
  });

  return { ...view, onUrlUpdate };
};

describe('useMapFilters', () => {
  it('reads empty filters by default', () => {
    const { result } = renderFilters('');

    expect(result.current).toMatchObject({ filters: { q: '', modes: [], camo: [] }, isFiltered: false, activeCount: 0, active: [] });
  });

  it('reads filters from the URL', () => {
    const { result } = renderFilters('?q=ens&modes=assault');

    expect(result.current).toMatchObject({ filters: { q: 'ens', modes: ['assault'], camo: [] }, isFiltered: true, activeCount: 2 });
    expect(result.current.active.map(({ id }) => id)).toEqual(['q', 'modes']);
  });

  it('removes one filter from its chip', async () => {
    const { result } = renderFilters('?q=ens&modes=assault');

    await act(async () => result.current.active.find(({ id }) => id === 'modes')?.onRemove());

    expect(result.current.filters).toMatchObject({ q: 'ens', modes: [] });
  });

  it('writes the search and clears everything on reset', async () => {
    const { result, onUrlUpdate } = renderFilters('?modes=assault');

    await act(async () => result.current.onQueryChange('prokh'));

    expect(result.current.filters.q).toBe('prokh');

    await act(async () => result.current.onReset());

    expect(result.current.isFiltered).toBe(false);
    await vi.waitFor(() => expect(onUrlUpdate).toHaveBeenLastCalledWith(expect.objectContaining({ queryString: '' })));
  });
});
