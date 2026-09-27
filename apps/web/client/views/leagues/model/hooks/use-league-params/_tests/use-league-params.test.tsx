import { act, renderHook } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it } from 'vitest';

import { useLeagueParams } from '../use-league-params';

const renderParams = (searchParams: string) =>
  renderHook(() => useLeagueParams(), { wrapper: withNuqsTestingAdapter({ searchParams, hasMemory: true }) });

describe('useLeagueParams', () => {
  it('opens the own division of the current week by default', () => {
    const { result } = renderParams('');

    expect(result.current).toMatchObject({ scope: 'division', metric: 'damage', week: null });
  });

  it('falls back to the defaults for unknown values', () => {
    const { result } = renderParams('?scope=world&metric=elo&week=2026-09-14');

    expect(result.current).toMatchObject({ scope: 'division', metric: 'damage', week: '2026-09-14' });
  });

  it('switches the scope, the metric and the week', async () => {
    const { result } = renderParams('');

    await act(async () => result.current.onScopeChange('friends'));
    await act(async () => result.current.onMetricChange('wn8'));
    await act(async () => result.current.onWeekChange('2026-09-07'));

    expect(result.current).toMatchObject({ scope: 'friends', metric: 'wn8', week: '2026-09-07' });

    await act(async () => result.current.onWeekChange(null));

    expect(result.current.week).toBeNull();
  });
});
