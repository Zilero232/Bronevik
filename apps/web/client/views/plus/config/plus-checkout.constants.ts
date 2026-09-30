import type { NotificationEvent } from '@otmetki/schemas';

export const PLUS_CHECKOUT = {
  anchor: 'checkout',
  plansStaleMs: 30 * 60_000,
  priceFormat: { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 },
  planSkeletonCount: 3,
  selectionLayoutId: 'plus-plan-selection'
} as const;

export const CHECKOUT_NOTIFY = {
  event: 'plus_checkout_open',
  skeleton: { width: 260, height: 40 }
} as const satisfies { event: NotificationEvent; skeleton: { width: number; height: number } };
