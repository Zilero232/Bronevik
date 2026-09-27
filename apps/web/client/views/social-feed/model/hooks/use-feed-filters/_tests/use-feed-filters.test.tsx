import { act, renderHook } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it } from 'vitest';

import { useFeedFilters } from '../use-feed-filters';

const renderFilters = (searchParams: string) => renderHook(() => useFeedFilters(), { wrapper: withNuqsTestingAdapter({ searchParams }) });

describe('useFeedFilters', () => {
  it('shows two weeks of every kind by default', () => {
    const { result } = renderFilters('');

    expect(result.current).toMatchObject({ days: '14', kind: 'all' });
  });

  it('ignores unknown values in the URL', () => {
    const { result } = renderFilters('?days=365&kind=everything');

    expect(result.current).toMatchObject({ days: '14', kind: 'all' });
  });

  it('changes the period and the kind', async () => {
    const { result } = renderFilters('?days=7');

    expect(result.current.days).toBe('7');

    await act(async () => result.current.onKindChange('record'));
    await act(async () => result.current.onDaysChange('30'));

    expect(result.current).toMatchObject({ days: '30', kind: 'record' });
  });
});
