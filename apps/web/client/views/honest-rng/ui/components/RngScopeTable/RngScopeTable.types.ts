import type { ReactNode } from 'react';

export type RngScopeRow = {
  id: string;
  label: ReactNode;
  shots: number;
  meanRoll: number | null;
  within: number | null;
};

export type RngScopeTableProps = {
  title: string;
  scopeLabel: string;
  rows: readonly RngScopeRow[];
};
