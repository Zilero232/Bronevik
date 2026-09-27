import { COMPETITION_STATUSES } from '@otmetki/schemas';

export const COMPETITION_FILTERS = ['all', ...COMPETITION_STATUSES] as const;

export const COMPETITION_LIST = {
  pageSize: 20,
  defaultFilter: 'all',
  skeletonHeight: 56,
  dateFormat: { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
} as const;
