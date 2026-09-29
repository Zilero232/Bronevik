export type PinnedFirstInput<R extends { id: string }> = {
  rows: readonly R[];
  pinnedIds: readonly string[] | undefined;
};
