export const PLUS_CHECKOUT = {
  anchor: 'checkout',
  plansStaleMs: 30 * 60_000,
  priceFormat: { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }
} as const;
