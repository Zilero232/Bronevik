import type { ReactNode } from 'react';

export type CalcShellProps = {
  title: ReactNode;
  description?: ReactNode;
  inputs: ReactNode;
  results: ReactNode;
  footer?: ReactNode;
};
