import type { PaymentHistoryItem } from '@bronevik/schemas';

export type DateCellProps = Pick<PaymentHistoryItem, 'createdAt'>;
