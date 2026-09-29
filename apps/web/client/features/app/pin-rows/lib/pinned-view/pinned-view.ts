import type { PinnedView, PinnedViewInput } from './pinned-view.types';

export const pinnedView = ({ isPinnedOnly, pinnedIds }: PinnedViewInput): PinnedView => ({
  isPending: isPinnedOnly && pinnedIds === null,
  filterIds: isPinnedOnly ? (pinnedIds ?? []) : null,
  rowIds: pinnedIds ?? undefined
});
