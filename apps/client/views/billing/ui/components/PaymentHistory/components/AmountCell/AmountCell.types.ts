import type { PaymentHistoryItem } from '@otmetki/schemas';

export type AmountCellProps = Pick<PaymentHistoryItem, 'amount' | 'currency'>;
