import { ROUTES } from '@/shared/constants';

export const ACCOUNT_TABS = [
  { key: 'overview', href: ROUTES.me },
  { key: 'notifications', href: ROUTES.account.notifications },
  { key: 'billing', href: ROUTES.account.billing },
  { key: 'telegram', href: ROUTES.account.telegram },
  { key: 'developer', href: ROUTES.account.developer },
  { key: 'streamer', href: ROUTES.account.streamer }
] as const;

export const ACCOUNT_SHELL = {
  skeletonHeights: [36, 96, 320]
} as const;
