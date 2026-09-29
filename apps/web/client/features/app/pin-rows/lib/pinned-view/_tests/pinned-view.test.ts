import { describe, expect, it } from 'vitest';

import { pinnedView } from '../pinned-view';

describe('pinnedView', () => {
  it('waits for the stored pins before filtering to pinned rows', () => {
    expect(pinnedView({ isPinnedOnly: true, pinnedIds: null })).toEqual({ isPending: true, filterIds: [], rowIds: undefined });
  });

  it('filters to the stored pins once they are read, even when there are none', () => {
    expect(pinnedView({ isPinnedOnly: true, pinnedIds: [] })).toEqual({ isPending: false, filterIds: [], rowIds: [] });
  });

  it('never waits or filters when the pinned filter is off', () => {
    expect(pinnedView({ isPinnedOnly: false, pinnedIds: null })).toEqual({ isPending: false, filterIds: null, rowIds: undefined });
    expect(pinnedView({ isPinnedOnly: false, pinnedIds: ['1'] })).toEqual({ isPending: false, filterIds: null, rowIds: ['1'] });
  });
});
