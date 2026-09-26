import { secondsInDay } from 'date-fns/constants';

export const SESSION = {
  expiresIn: 30 * secondsInDay,
  updateAge: secondsInDay
} as const;

export const PLACEHOLDER_EMAIL = {
  domain: 'users.otmetki.invalid'
} as const;

export const AUTH_PROVIDER = {
  lesta: 'lesta-id',
  telegram: 'telegram',
  discord: 'discord',
  vk: 'vk'
} as const;

export const API_KEY_PLUGIN = {
  modelName: 'apiKey',
  prefix: 'otm_',
  keyLength: 64,
  minExpiresInDays: 0,
  maxExpiresInDays: 3_650
} as const;

export const VK_MINI_APP_AUTH = {
  maxAgeSeconds: 86_400,
  launchParamsMaxLength: 4096,
  fallbackName: 'VK {id}'
} as const;
