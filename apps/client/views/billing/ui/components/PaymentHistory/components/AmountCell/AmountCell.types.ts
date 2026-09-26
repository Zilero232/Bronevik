import type { PaymentHistoryItem } from '@bronevik/schemas';

export type AmountCellProps = Pick<PaymentHistoryItem, 'amount' | 'currency'>;
