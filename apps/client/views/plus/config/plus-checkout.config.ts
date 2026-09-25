export const PLUS_CHECKOUT = {
  anchor: 'plus-checkout',
  defaultPlan: 'yearly',
  plansStaleMs: 30 * 60_000,
  priceFormat: { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }
} as const;
