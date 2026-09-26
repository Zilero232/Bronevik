import type { ApiErrorLogEntry } from '@bronevik/schemas';

export type RequestCellProps = Pick<ApiErrorLogEntry, 'method' | 'path'>;
