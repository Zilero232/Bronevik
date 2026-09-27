import { Writable } from 'node:stream';
import pino from 'pino';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { REDACTION } from '../logger.constants';
import { resolveLevel, resolveTransport, wantsJson } from '../logger.transport';

const setEnv = (env: Record<string, string | undefined>) => {
  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value);
  }
};

describe('logger helpers', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefers an explicit LOG_FORMAT over NODE_ENV', () => {
    setEnv({ NODE_ENV: 'production', LOG_FORMAT: 'pretty' });

    expect(wantsJson()).toBe(false);

    setEnv({ NODE_ENV: 'development', LOG_FORMAT: 'json' });

    expect(wantsJson()).toBe(true);
  });

  it('falls back to JSON only in production', () => {
    setEnv({ LOG_FORMAT: '', NODE_ENV: 'production' });

    expect(wantsJson()).toBe(true);

    setEnv({ NODE_ENV: 'development' });

    expect(wantsJson()).toBe(false);
  });

  it('resolves the level from the argument, then LOG_LEVEL, then the environment default', () => {
    setEnv({ LOG_LEVEL: 'warn', NODE_ENV: 'production' });

    expect(resolveLevel('trace')).toBe('trace');
    expect(resolveLevel(undefined)).toBe('warn');

    setEnv({ LOG_LEVEL: '' });

    expect(resolveLevel(undefined)).not.toBe('warn');
  });

  it('adds a pretty transport outside JSON mode and merges the ignored keys', () => {
    setEnv({ LOG_FORMAT: 'pretty' });

    const { transport } = resolveTransport({ ignore: 'context', messageFormat: '{msg}' });

    expect(transport).toMatchObject({ target: 'pino-pretty', options: { messageFormat: '{msg}' } });
    expect(JSON.stringify(transport)).toContain('service,context');
  });

  it('drops the transport in JSON mode', () => {
    setEnv({ LOG_FORMAT: 'json' });

    expect(resolveTransport(undefined)).toEqual({});
  });
});

describe('redaction', () => {
  it('censors every configured secret path', () => {
    const lines: string[] = [];
    const sink = new Writable({
      write: (chunk, _encoding, done) => {
        lines.push(String(chunk));
        done();
      }
    });

    const logger = pino({ redact: { paths: [...REDACTION.paths], censor: REDACTION.censor } }, sink);

    logger.info({ accessToken: 'a', user: { password: 'b', apiKey: 'c' }, nickname: 'visible' });

    const [line = ''] = lines;

    expect(line).not.toMatch(/"[abc]"/);
    expect(line).toContain('visible');
    expect(line.split(REDACTION.censor)).toHaveLength(4);
  });
});
