import type { ApiErrorCode, PlusCountKey } from '@otmetki/schemas';

export const PLUS_COUNT_KEYS: readonly PlusCountKey[] = ['linkedAccounts', 'goals', 'watchedTanks', 'overlays', 'storedReplays'];

export const PROMO_REJECTION_CODES: readonly ApiErrorCode[] = [
  'PROMO_INVALID',
  'PROMO_EXPIRED',
  'PROMO_EXHAUSTED',
  'PROMO_ALREADY_REDEEMED',
  'PROMO_CHECKOUT_ONLY',
  'PROMO_REDEEM_ONLY'
];
