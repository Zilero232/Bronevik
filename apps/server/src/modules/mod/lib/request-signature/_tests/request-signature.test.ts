import { describe, expect, it } from 'vitest';

import { MOD_REQUEST } from '../../../config';
import { isFreshTimestamp, isNonce, requestPath, signedMessage } from '../request-signature';

const NOW = new Date('2026-09-27T12:00:00.000Z');
const NOW_SECONDS = NOW.getTime() / 1000;
const BASE = { method: 'post', path: '/mod/ingest', timestamp: String(NOW_SECONDS), nonce: 'n'.repeat(16), body: Buffer.from('{}') };

describe('signedMessage', () => {
  it('binds the version, method, path, timestamp and nonce ahead of the raw body', () => {
    expect(signedMessage(BASE).toString()).toBe(`${MOD_REQUEST.version}\nPOST\n/mod/ingest\n${NOW_SECONDS}\n${'n'.repeat(16)}\n{}`);
  });

  it('changes when the request is replayed against another path', () => {
    expect(signedMessage(BASE).equals(signedMessage({ ...BASE, path: '/mod/settings' }))).toBe(false);
  });
});

describe('isFreshTimestamp', () => {
  it('accepts a timestamp exactly at the allowed skew on either side', () => {
    expect(isFreshTimestamp({ timestamp: String(NOW_SECONDS - MOD_REQUEST.maxSkewSeconds), now: NOW })).toBe(true);
    expect(isFreshTimestamp({ timestamp: String(NOW_SECONDS + MOD_REQUEST.maxSkewSeconds), now: NOW })).toBe(true);
  });

  it('rejects a timestamp one second past the allowed skew', () => {
    expect(isFreshTimestamp({ timestamp: String(NOW_SECONDS - MOD_REQUEST.maxSkewSeconds - 1), now: NOW })).toBe(false);
  });

  it('rejects a missing or non-numeric timestamp', () => {
    expect(isFreshTimestamp({ timestamp: undefined, now: NOW })).toBe(false);
    expect(isFreshTimestamp({ timestamp: '1e9', now: NOW })).toBe(false);
  });
});

describe('isNonce', () => {
  it('accepts a url-safe token of the allowed length', () => {
    expect(isNonce('a'.repeat(16))).toBe(true);
  });

  it('rejects a short, missing or unsafe nonce', () => {
    expect(isNonce('a'.repeat(15))).toBe(false);
    expect(isNonce(undefined)).toBe(false);
    expect(isNonce(`${'a'.repeat(16)}:x`)).toBe(false);
  });
});

describe('requestPath', () => {
  it('drops the query string', () => {
    expect(requestPath('/mod/settings/apply/1/result?x=1')).toBe('/mod/settings/apply/1/result');
  });
});
