import type { MoeRow } from '@otmetki/schemas';

export type FilterByNameInput = {
  rows: MoeRow[];
  query: string;
};
