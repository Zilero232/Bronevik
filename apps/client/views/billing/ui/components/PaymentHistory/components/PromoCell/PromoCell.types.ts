import type { PaymentHistoryItem } from '@otmetki/schemas';

export type PromoCellProps = Pick<PaymentHistoryItem, 'promoCode'>;
