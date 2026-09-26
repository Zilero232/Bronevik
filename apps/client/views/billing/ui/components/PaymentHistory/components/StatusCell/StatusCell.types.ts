import type { PaymentHistoryItem } from '@bronevik/schemas';

export type StatusCellProps = Pick<PaymentHistoryItem, 'status'>;
