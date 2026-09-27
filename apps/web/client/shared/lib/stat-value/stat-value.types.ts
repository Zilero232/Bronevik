export type StatValueKind = 'count' | 'decimal' | 'percent';

export type StatValueTextInput = {
  value: number | string | null | undefined;
  kind?: StatValueKind;
  locale: string;
};
