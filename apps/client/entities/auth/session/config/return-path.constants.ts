import { ROUTES } from '@/shared/constants';

export const RETURN_PATH = {
  origin: 'http://return.invalid',
  fallback: ROUTES.account.overview
} as const;
