import type { ReactNode } from 'react';

import type { CellHint } from '../../../lib/compare-guess';

export type GuessCellProps = {
  hint: CellHint;
  label: string;
  text: string;
  children: ReactNode;
};
