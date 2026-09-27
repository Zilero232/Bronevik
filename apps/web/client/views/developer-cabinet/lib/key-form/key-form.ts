import type { CreateApiKeyInput } from '@otmetki/schemas';

import { addDays } from 'date-fns';

import type { ExpiryToIsoInput, ToCreateApiKeyInput } from './key-form.types';

export const expiryToIso = ({ expiry, now }: ExpiryToIsoInput): string | undefined =>
  expiry === 'never' ? undefined : addDays(now, Number(expiry)).toISOString();

export const toCreateApiKeyInput = ({ name, expiry, now }: ToCreateApiKeyInput): CreateApiKeyInput => {
  const expiresAt = expiryToIso({ expiry, now });

  return expiresAt === undefined ? { name: name.trim() } : { name: name.trim(), expiresAt };
};
