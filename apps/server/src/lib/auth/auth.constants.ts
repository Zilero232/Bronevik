import { secondsInDay } from 'date-fns/constants';

export const SESSION = {
  expiresIn: 30 * secondsInDay,
  updateAge: secondsInDay
} as const;

export const PLACEHOLDER_EMAIL = {
  domain: 'users.bronevik.invalid'
} as const;

export const AUTH_PROVIDER = {
  lesta: 'lesta-id',
  telegram: 'telegram'
} as const;
