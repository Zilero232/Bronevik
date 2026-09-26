import type { ApiErrorLogEntry } from '@otmetki/schemas';

export type RequestCellProps = Pick<ApiErrorLogEntry, 'method' | 'path'>;
