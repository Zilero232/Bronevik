import { act, renderHook } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it } from 'vitest';

import { useRosterFilters } from '../use-roster-filters';

const renderFilters = (searchParams: string) => renderHook(() => useRosterFilters(), { wrapper: withNuqsTestingAdapter({ searchParams }) });

describe('useRosterFilters', () => {
  it('shows everyone by default', () => {
    const { result } = renderFilters('');

    expect(result.current).toMatchObject({ role: 'all', idle: 'all', isFiltered: false });
  });

  it('falls back to all for an unknown role', () => {
    const { result } = renderFilters('?role=admirals&idle=14');

    expect(result.current).toMatchObject({ role: 'all', idle: '14', isFiltered: true });
  });

  it('changes and resets the filters', async () => {
    const { result } = renderFilters('');

    await act(async () => result.current.onRoleChange('officers'));

    expect(result.current).toMatchObject({ role: 'officers', isFiltered: true });

    await act(async () => result.current.onReset());

    expect(result.current).toMatchObject({ role: 'all', idle: 'all', isFiltered: false });
  });
});
