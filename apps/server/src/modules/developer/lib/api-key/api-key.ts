import type { ApiKey } from '@bronevik/schemas';

import { createHash, randomBytes } from 'node:crypto';

import type { ApiKeyRow, GeneratedApiKey, MatchesApiKeyHashInput } from './api-key.types';

import { timingSafeEqual, toIso } from '../../../../common/lib';
import { API_KEY_FORMAT } from '../../config';

export const hashApiKey = (key: string): string => createHash('sha256').update(key).digest('hex');

export const generateApiKey = (): GeneratedApiKey => {
  const prefix = randomBytes(API_KEY_FORMAT.prefixBytes).toString('base64url');
  const secret = randomBytes(API_KEY_FORMAT.secretBytes).toString('base64url');
  const key = `${API_KEY_FORMAT.label}_${prefix}_${secret}`;

  return { key, prefix, hash: hashApiKey(key) };
};

export const apiKeyPrefix = (key: string): string | null => API_KEY_FORMAT.pattern.exec(key.trim())?.[1] ?? null;

export const matchesApiKeyHash = ({ key, hash }: MatchesApiKeyHashInput): boolean => timingSafeEqual(hashApiKey(key.trim()), hash);

export const toApiKey = (row: ApiKeyRow): ApiKey => ({
  id: row.id,
  name: row.name,
  prefix: row.prefix,
  plan: row.plan,
  scopes: row.scopes,
  createdAt: row.createdAt.toISOString(),
  lastUsedAt: toIso(row.lastUsedAt),
  expiresAt: toIso(row.expiresAt),
  revokedAt: toIso(row.revokedAt)
});
