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

export const API_KEY_PLUGIN = {
  modelName: 'apiKey',
  prefix: 'brv_',
  keyLength: 64,
  minExpiresInDays: 0,
  maxExpiresInDays: 3_650
} as const;
