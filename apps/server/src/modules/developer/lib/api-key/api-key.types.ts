import type { ApiKey } from '../../../../../generated';

export type GeneratedApiKey = {
  key: string;
  prefix: string;
  hash: string;
};

export type MatchesApiKeyHashInput = {
  key: string;
  hash: string;
};

export type ApiKeyRow = Pick<ApiKey, 'createdAt' | 'expiresAt' | 'id' | 'lastUsedAt' | 'name' | 'plan' | 'prefix' | 'revokedAt' | 'scopes'>;
