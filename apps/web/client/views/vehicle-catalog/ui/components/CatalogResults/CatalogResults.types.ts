import type { ReactNode } from 'react';

import type { QueryStateSource } from '@/ui-kit';

import type { CatalogTierGroup } from '../../../lib/catalog-filter';

export type CatalogResultsData = {
  groups: CatalogTierGroup[];
  shown: number;
};

export type CatalogResultsProps = {
  query: QueryStateSource<CatalogResultsData>;
  empty: ReactNode;
  summary?: (shown: number) => ReactNode;
};
