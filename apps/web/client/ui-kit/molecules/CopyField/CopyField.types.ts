import type { ReactNode } from 'react';

export type CopyFieldProps = {
  value: string;
  label?: ReactNode;
  isSecret?: boolean;
  tone?: 'accent' | 'neutral';
  className?: string;
  onCopy?: () => void;
};
