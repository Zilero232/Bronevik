import type { PaymentHistoryItem } from '@otmetki/schemas';

export type DateCellProps = Pick<PaymentHistoryItem, 'createdAt'>;
