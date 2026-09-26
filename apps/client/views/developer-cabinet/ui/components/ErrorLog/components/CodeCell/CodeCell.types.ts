import type { ApiErrorLogEntry } from '@bronevik/schemas';

export type CodeCellProps = Pick<ApiErrorLogEntry, 'code' | 'message'>;
