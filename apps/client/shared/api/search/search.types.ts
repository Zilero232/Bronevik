export type SearchInput = {
  query: string;
  signal?: AbortSignal;
};

export type WaitInput = {
  ms: number;
  signal?: AbortSignal;
};

export type MatchesInput = {
  value: string;
  query: string;
};
