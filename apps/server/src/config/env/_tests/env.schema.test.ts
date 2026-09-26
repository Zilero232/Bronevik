import { describe, expect, it } from 'vitest';

import { isProduction, validateEnv } from '../env.schema';
import { LESTA_MOCK } from '../../lesta-mock';

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
    expect(validateEnv({ ...base, LESTA_MOCK: 'off' }).LESTA_APPLICATION_ID).toBe('');
  });

  it('switches the Lesta mock on in development when the key is empty', () => {
    const env = validateEnv({ ...base, NODE_ENV: 'development' });

    expect(env.LESTA_MOCK).toBe('on');
    expect(env.LESTA_APPLICATION_ID).toBe(LESTA_MOCK.applicationId);
  });

  it('keeps the Lesta mock off when the real key is set, in production and under tests', () => {
    expect(validateEnv({ ...base, LESTA_APPLICATION_ID: 'real-key' })).toMatchObject({ LESTA_MOCK: 'off', LESTA_APPLICATION_ID: 'real-key' });
    expect(validateEnv({ ...base, NODE_ENV: 'production', LESTA_MOCK: 'on' })).toMatchObject({ LESTA_MOCK: 'off', LESTA_APPLICATION_ID: '' });
    expect(validateEnv({ ...base, NODE_ENV: 'test' }).LESTA_MOCK).toBe('off');
    expect(validateEnv({ ...base, NODE_ENV: 'test', LESTA_MOCK: 'on' }).LESTA_MOCK).toBe('on');
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
