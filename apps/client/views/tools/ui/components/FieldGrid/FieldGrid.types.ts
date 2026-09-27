import type { ReactNode } from 'react';

export type FieldSpec<K extends string> = {
  key: K;
  label: ReactNode;
  min: number;
  max: number;
  step: number;
  suffix?: ReactNode;
  hint?: ReactNode;
};

export type FieldGridProps<K extends string> = {
  fields: readonly FieldSpec<K>[];
  values: NoInfer<Record<K, number | null>>;
  field: NoInfer<(key: K) => (value: number | null) => void>;
};
