export type SpecBestInput = {
  key: string;
  values: readonly (number | null | undefined)[];
};

export type SpecDeltaInput = {
  key: string;
  before: number | null | undefined;
  after: number | null | undefined;
};

export type SpecVerdict = 'better' | 'same' | 'worse';
