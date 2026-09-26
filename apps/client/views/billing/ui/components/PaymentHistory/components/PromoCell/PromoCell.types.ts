import type { PaymentHistoryItem } from '@bronevik/schemas';

export type PromoCellProps = Pick<PaymentHistoryItem, 'promoCode'>;
