export const BILLING_QUEUE = {
  name: 'billing.renewals',
  jobs: { renew: 'renew', expire: 'expire' }
} as const;
