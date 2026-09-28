import { describe, expect, it } from 'vitest';

import { dataTableLayout } from '@/shared/lib';

describe('dataTableLayout', () => {
  it('always shows only the table when there is no card renderer', () => {
    expect(dataTableLayout({ hasCards: false, isHydrated: true, isCompact: true })).toEqual({ showTable: true, showCards: false });
  });

  it('renders both layouts before hydration so CSS picks one on the server markup', () => {
    expect(dataTableLayout({ hasCards: true, isHydrated: false, isCompact: false })).toEqual({ showTable: true, showCards: true });
  });

  it('renders only the cards on a compact viewport after hydration', () => {
    expect(dataTableLayout({ hasCards: true, isHydrated: true, isCompact: true })).toEqual({ showTable: false, showCards: true });
  });

  it('renders only the table on a wide viewport after hydration', () => {
    expect(dataTableLayout({ hasCards: true, isHydrated: true, isCompact: false })).toEqual({ showTable: true, showCards: false });
  });
});
