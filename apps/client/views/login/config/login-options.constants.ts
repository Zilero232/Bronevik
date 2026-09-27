import { env } from '@/shared/config';

export const LOGIN_OPTIONS = {
  isDevAuth: env.NODE_ENV !== 'production'
} as const;
