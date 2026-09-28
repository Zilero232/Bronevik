import { describe, expect, it } from 'vitest';

import { LESTA_MOCK } from '../../lesta-mock';
import { LESTA } from '../../lesta.constants';
import { isProduction, validateEnv } from '../env';

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

  it('splits the registered Lesta egress IPs and caps them at the Lesta limit', () => {
    const ips = Array.from({ length: LESTA.egress.maxIps }, (_, index) => `10.0.0.${index + 1}`);

    expect(validateEnv({ ...base, LESTA_EGRESS_IPS: ips.join(', ') }).LESTA_EGRESS_IPS).toEqual(ips);
    expect(() => validateEnv({ ...base, LESTA_EGRESS_IPS: [...ips, '10.0.0.99'].join(',') })).toThrow(/LESTA_EGRESS_IPS/);
    expect(validateEnv(base).LESTA_EGRESS_IPS).toEqual([]);
  });

  it('refuses an egress IP that is not one of the registered ones', () => {
    expect(() => validateEnv({ ...base, LESTA_EGRESS_IPS: '10.0.0.1', LESTA_EGRESS_IP: '10.0.0.2' })).toThrow(/LESTA_EGRESS_IP/);
    expect(validateEnv({ ...base, LESTA_EGRESS_IPS: '10.0.0.1', LESTA_EGRESS_IP: '10.0.0.1' }).LESTA_EGRESS_IP).toBe('10.0.0.1');
  });

  it('coerces numeric variables', () => {
    expect(validateEnv({ ...base, LESTA_RPS: '7' }).LESTA_RPS).toBe(7);
  });

  it('rejects an auth secret too short to be safe', () => {
    expect(() => validateEnv({ ...base, BETTER_AUTH_SECRET: 'short' })).toThrow(/BETTER_AUTH_SECRET/);
  });
});

describe('validateEnv fail-closed guards', () => {
  const deployed = { ...base, API_URL: 'https://api.triotmetki.ru', WEB_URL: 'https://triotmetki.ru' };

  it('refuses a deployed API that does not say which environment it runs in', () => {
    expect(() => validateEnv(deployed)).toThrow(/NODE_ENV/);
  });

  it('defaults to development only on a local host', () => {
    expect(validateEnv(base).NODE_ENV).toBe('development');
  });

  it('never turns the Lesta mock on by itself for a public API', () => {
    expect(validateEnv({ ...deployed, NODE_ENV: 'development' }).LESTA_MOCK).toBe('off');
  });

  it.each(['BETTER_AUTH_SECRET', 'MOD_INGEST_SECRET'])('refuses a development placeholder %s in production', (name) => {
    expect(() => validateEnv({ ...deployed, NODE_ENV: 'production', [name]: 'dev-secret-change-me-min-32-chars-000' })).toThrow(name);
  });

  it('accepts real secrets in production', () => {
    expect(validateEnv({ ...deployed, NODE_ENV: 'production' }).NODE_ENV).toBe('production');
  });
});

describe('validateEnv demo mode', () => {
  const deployed = { ...base, API_URL: 'https://api.triotmetki.ru', WEB_URL: 'https://triotmetki.ru', NODE_ENV: 'production' };

  it('is off unless asked for', () => {
    expect(validateEnv(deployed)).toMatchObject({ DEMO_MODE: false, LESTA_MOCK: 'off' });
  });

  it('serves the Lesta mock from a production build only with DEMO_MODE', () => {
    expect(validateEnv({ ...deployed, DEMO_MODE: 'true' })).toMatchObject({
      DEMO_MODE: true,
      LESTA_MOCK: 'on',
      LESTA_APPLICATION_ID: LESTA_MOCK.applicationId
    });

    expect(validateEnv({ ...deployed, DEMO_MODE: 'true', LESTA_MOCK: 'off' }).LESTA_MOCK).toBe('on');
  });

  it.each(['LESTA_APPLICATION_ID', 'YOOKASSA_SHOP_ID', 'YOOKASSA_SECRET_KEY'])('refuses to start a demo while %s is set', (name) => {
    expect(() => validateEnv({ ...deployed, DEMO_MODE: 'true', [name]: 'real-value' })).toThrow(`DEMO_MODE is on while ${name} is set`);
  });

  it('validates its own resolved env again without mistaking the mock id for a key', () => {
    const first = validateEnv({ ...deployed, DEMO_MODE: 'true' });

    expect(validateEnv({ ...deployed, DEMO_MODE: 'true', LESTA_APPLICATION_ID: first.LESTA_APPLICATION_ID })).toMatchObject({
      LESTA_MOCK: 'on',
      LESTA_APPLICATION_ID: LESTA_MOCK.applicationId
    });
  });

  it('still refuses placeholder secrets in a demo', () => {
    expect(() => validateEnv({ ...deployed, DEMO_MODE: 'true', MOD_INGEST_SECRET: 'placeholder-secret' })).toThrow(/MOD_INGEST_SECRET/);
  });
});

describe('isProduction', () => {
  it('is true only for NODE_ENV=production', () => {
    expect(isProduction({ NODE_ENV: 'production' })).toBe(true);
    expect(isProduction({ NODE_ENV: 'development' })).toBe(false);
    expect(isProduction({ NODE_ENV: 'test' })).toBe(false);
  });
});
