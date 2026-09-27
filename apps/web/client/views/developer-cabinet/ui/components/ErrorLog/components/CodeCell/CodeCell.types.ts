import type { ApiErrorLogEntry } from '@otmetki/schemas';

export type CodeCellProps = Pick<ApiErrorLogEntry, 'code' | 'message'>;
