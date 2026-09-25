import type { z } from 'zod';

import type { cursorQuerySchema, paginationQuerySchema, sortOrderSchema } from './query.schemas';

export type SortOrder = z.infer<typeof sortOrderSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type CursorQuery = z.infer<typeof cursorQuerySchema>;

export type Paginated<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};
