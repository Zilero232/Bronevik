import { act, renderHook } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it } from 'vitest';

import { useWorkspaceTab } from '../use-workspace-tab';

const renderTab = (searchParams: string) => renderHook(() => useWorkspaceTab(), { wrapper: withNuqsTestingAdapter({ searchParams }) });

describe('useWorkspaceTab', () => {
  it('opens the overview by default and for unknown tabs', () => {
    expect(renderTab('').result.current[0]).toBe('overview');
    expect(renderTab('?tab=treasury').result.current[0]).toBe('overview');
  });

  it('switches the tab', async () => {
    const { result } = renderTab('?tab=events');

    expect(result.current[0]).toBe('events');

    await act(async () => result.current[1]('roster'));

    expect(result.current[0]).toBe('roster');
  });
});
