export type FormatNumberInput = {
  value: number | null | undefined;
  locale: string;
  digits?: number;
  grouping?: boolean;
};

export type FormatPercentInput = Omit<FormatNumberInput, 'grouping'>;

export type FormatOrInput<T> = T & {
  missing: string;
};
