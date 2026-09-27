import type { ReactNode } from 'react';

import type { ResultTone } from '../ResultFigure/ResultFigure.types';

export type ResultListItem = {
  key: string;
  label: ReactNode;
  value: ReactNode;
  tone?: ResultTone;
};

export type ResultListProps = {
  items: ResultListItem[];
};
