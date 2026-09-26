import type { PaymentHistoryItem } from '@bronevik/schemas';

export type ChargeCellProps = Pick<PaymentHistoryItem, 'isAutoCharge'>;
