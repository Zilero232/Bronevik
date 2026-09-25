export const BILLING_PATHS = {
  plans: '/billing/plans',
  status: '/me/billing',
  history: '/me/billing/history',
  checkout: '/me/billing/checkout',
  cancel: '/me/billing/cancel',
  resume: '/me/billing/resume',
  promo: '/me/billing/promo',
  referral: '/me/billing/referral'
} as const;

export const REFERRAL = {
  param: 'ref'
} as const;
