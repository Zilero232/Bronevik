import { describe, expect, it } from 'vitest';

import { redisConnection } from '../redis-connection';

describe('redisConnection', () => {
  it('reads host, port and database from the url', () => {
    expect(redisConnection('redis://localhost:6380/2')).toEqual({ host: 'localhost', port: 6380, options: { db: 2 } });
  });

  it('keeps credentials and falls back to the default port', () => {
    expect(redisConnection('redis://user:p%40ss@cache')).toEqual({ host: 'cache', port: 6379, options: { username: 'user', password: 'p@ss' } });
  });

  it('switches tls on for rediss urls', () => {
    expect(redisConnection('rediss://cache:6390').options).toEqual({ tls: {} });
  });
});
