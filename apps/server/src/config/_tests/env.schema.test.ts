import { describe, expect, it } from 'vitest';

import { isProduction, validateEnv } from '../env.schema';

const base = {
  DATABASE_URL: 'postgresql://user:pass@localhost:5434/db',
  REDIS_URL: 'redis://localhost:6380',
  API_URL: 'http://localhost:4000',
  WEB_URL: 'http://localhost:3000',
  BETTER_AUTH_SECRET: 'x'.repeat(32),
  MOD_INGEST_SECRET: 'mod-secret'
};

describe('validateEnv', () => {
  it('throws when a required variable is missing', () => {
    expect(() => validateEnv({ ...base, DATABASE_URL: undefined })).toThrow(/DATABASE_URL/);
  });

  it('starts without a Lesta application id so the worker can run degraded', () => {
    expect(validateEnv(base).LESTA_APPLICATION_ID).toBe('');
  });

  it('coerces numeric variables', () => {
    expect(validateEnv({ ...base, LESTA_RPS: '7' }).LESTA_RPS).toBe(7);
  });

  it('rejects an auth secret too short to be safe', () => {
    expect(() => validateEnv({ ...base, BETTER_AUTH_SECRET: 'short' })).toThrow(/BETTER_AUTH_SECRET/);
  });
});

describe('isProduction', () => {
  it('is true only for NODE_ENV=production', () => {
    expect(isProduction({ NODE_ENV: 'production' })).toBe(true);
    expect(isProduction({ NODE_ENV: 'development' })).toBe(false);
    expect(isProduction({ NODE_ENV: 'test' })).toBe(false);
  });
});
