import type { ReactNode } from 'react';

type RngScopeRow = {
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
