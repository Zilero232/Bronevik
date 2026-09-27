export type FlattenInput = {
  value: unknown;
  prefix: string;
  depth: number;
};

export type SpecsRow = {
  tankId: number;
  specs: Record<string, number | null>;
};

export type JoinKeyInput = {
  prefix: string;
  key: string;
};
