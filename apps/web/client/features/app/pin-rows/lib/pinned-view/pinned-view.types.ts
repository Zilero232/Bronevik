export type PinnedViewInput = {
  isPinnedOnly: boolean;
  pinnedIds: readonly string[] | null;
};

export type PinnedView = {
  isPending: boolean;
  filterIds: readonly string[] | null;
  rowIds: readonly string[] | undefined;
};
