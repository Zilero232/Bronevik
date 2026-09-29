export type ArmorCompareStatus = 'error' | 'limited' | 'loading' | 'missing' | 'ready';

export type CompareStatusInput = {
  hasData: boolean;
  error: unknown;
};
