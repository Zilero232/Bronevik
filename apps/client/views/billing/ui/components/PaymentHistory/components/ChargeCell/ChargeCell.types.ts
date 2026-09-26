import type { PaymentHistoryItem } from '@otmetki/schemas';

export type ChargeCellProps = Pick<PaymentHistoryItem, 'isAutoCharge'>;
