export type CollectIdsInput = {
  value: unknown;
  key: string;
  depth?: number;
};

export type WalkInput = Required<CollectIdsInput> & {
  into: number[];
};
