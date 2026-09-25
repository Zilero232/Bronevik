import type { MoeRow } from '@bronevik/schemas';

export type FilterByNameInput = {
  rows: MoeRow[];
  query: string;
};
