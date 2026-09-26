import type { PaymentHistoryItem } from '@otmetki/schemas';

export type StatusCellProps = Pick<PaymentHistoryItem, 'status'>;
