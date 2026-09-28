import type { CatalogDependency } from '@/entities/catalog';

import type { DependencyStatus } from '../../api';
import type { Selection } from '../selection';

export type DependencyRow = {
  dependency: CatalogDependency;
  state: DependencyStatus['state'];
  file: string | null;
  checked: boolean;
  locked: boolean;
};

export type DependencyRowsInput = {
  dependencies: readonly CatalogDependency[];
  statuses: readonly DependencyStatus[];
  selection: Selection;
  excluded: Selection;
};
