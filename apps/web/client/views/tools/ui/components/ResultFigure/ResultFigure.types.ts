import type { ReactNode } from 'react';

export type ResultTone = 'bad' | 'good' | 'neutral';

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
