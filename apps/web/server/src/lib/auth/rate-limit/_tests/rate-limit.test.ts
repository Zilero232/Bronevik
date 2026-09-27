import RedisMock from 'ioredis-mock';
import { describe, expect, it } from 'vitest';

import { AUTH_RATE_LIMIT } from '../../auth.constants';
import { authRateLimitRules, redisRateLimit } from '../rate-limit';

const RULE = { window: 60, max: 3 };

describe('redisRateLimit', () => {
  it('allows requests up to the rule maximum within one window', async () => {
    const storage = redisRateLimit({ redis: new RedisMock() });

    for (let attempt = 0; attempt < RULE.max; attempt += 1) {
      await expect(storage.consume('ip|/lesta/start', RULE)).resolves.toEqual({ allowed: true, retryAfter: null });
    }
  });

  it('refuses the request past the maximum and says when the window frees up', async () => {
    const storage = redisRateLimit({ redis: new RedisMock() });

    for (let attempt = 0; attempt < RULE.max; attempt += 1) {
      await storage.consume('ip|/telegram/widget', RULE);
    }

    const refused = await storage.consume('ip|/telegram/widget', RULE);

    expect(refused.allowed).toBe(false);
    expect(refused.retryAfter).toBeGreaterThan(0);
    expect(refused.retryAfter).toBeLessThanOrEqual(RULE.window);
  });

  it('counts every key on its own', async () => {
    const storage = redisRateLimit({ redis: new RedisMock() });

    for (let attempt = 0; attempt < RULE.max; attempt += 1) {
      await storage.consume('one|/vk/mini-app', RULE);
    }

    await expect(storage.consume('two|/vk/mini-app', RULE)).resolves.toEqual({ allowed: true, retryAfter: null });
  });
});

describe('authRateLimitRules', () => {
  const ruleFor = (path: string) => {
    const rules = authRateLimitRules();
    const key = Object.keys(rules).find((pattern) => (pattern.endsWith('/*') ? path.startsWith(pattern.slice(0, -1)) : pattern === path));

    return key ? rules[key] : undefined;
  };

  it('gives OAuth callbacks their own looser rule ahead of the sign-in wildcards', () => {
    expect(ruleFor('/lesta/callback')).toEqual(AUTH_RATE_LIMIT.callback);
    expect(ruleFor('/callback/vk')).toEqual(AUTH_RATE_LIMIT.callback);
    expect(AUTH_RATE_LIMIT.callback.max).toBeGreaterThanOrEqual(AUTH_RATE_LIMIT.signIn.max);
  });

  it('keeps the sign-in starts on the sign-in rule', () => {
    expect(ruleFor('/lesta/start')).toEqual(AUTH_RATE_LIMIT.signIn);
    expect(ruleFor('/link-social')).toEqual(AUTH_RATE_LIMIT.signIn);
  });
});
