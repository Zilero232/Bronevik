export type LestaId = number | string;

export type ChunkIdsInput<Id extends LestaId> = {
  ids: readonly Id[];
  size?: number;
};

export type BatchByIdInput<Id extends LestaId, T> = {
  ids: readonly Id[];
  size?: number;
  run: (chunk: Id[]) => Promise<Record<string, T>>;
};

export type BatchListInput<Item extends LestaId, T> = {
  items: readonly Item[];
  size?: number;
  run: (chunk: Item[]) => Promise<T[]>;
};
