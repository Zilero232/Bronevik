import type { ReactNode } from 'react';

export type CalcShellProps = {
  title: ReactNode;
  description?: ReactNode;
  inputs: ReactNode;
  results: ReactNode;
  footer?: ReactNode;
};

export type ResultTone = 'accent' | 'bad' | 'good' | 'muted';

export type ResultFigureProps = {
  label: ReactNode;
  value: number | null;
  fallback?: ReactNode;
  suffix?: string;
  format?: Intl.NumberFormatOptions;
  hint?: ReactNode;
  tone?: ResultTone;
  size?: 'lg' | 'md';
};

export type ResultListItem = {
  key: string;
  label: ReactNode;
  value: ReactNode;
  tone?: ResultTone;
};

export type ResultListProps = {
  items: ResultListItem[];
};

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
  values: Record<K, number | null>;
  onChange: (change: { key: K; value: number | null }) => void;
};
