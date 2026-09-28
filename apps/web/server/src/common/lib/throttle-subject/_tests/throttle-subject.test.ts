import { INTERNAL_REQUEST } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { ThrottleRequest, ThrottleSubjectPolicy } from '../throttle-subject.types';

import { forwardedClientIp, isInternalToken, isTrustedPeer, throttleSubject } from '../throttle-subject';
import { THROTTLE_SUBJECT } from '../throttle-subject.constants';

const TOKEN = 'internal-token-that-is-long-enough-000';
const policy: ThrottleSubjectPolicy = { token: TOKEN, trustedProxies: [] };

const request = (overrides: Partial<ThrottleRequest> = {}): ThrottleRequest => ({
  headers: {},
  ip: '203.0.113.7',
  socket: { remoteAddress: '172.18.0.4' },
  ...overrides
});

const internal = (headers: ThrottleRequest['headers'] = {}): ThrottleRequest =>
  request({ ip: '198.51.100.20', headers: { [INTERNAL_REQUEST.tokenHeader]: TOKEN, ...headers } });

describe('throttleSubject', () => {
  it('throttles a browser request by its own address', () => {
    expect(throttleSubject({ request: request(), policy })).toEqual({ tracker: '203.0.113.7', isInternal: false });
  });

  it('throttles a server-rendered request by the visitor address it forwards', () => {
    const subject = throttleSubject({ request: internal({ [INTERNAL_REQUEST.clientIpHeader]: '192.0.2.10, 10.0.0.1' }), policy });

    expect(subject).toEqual({ tracker: '192.0.2.10', isInternal: false });
  });

  it('puts a trusted request without a visitor address into the shared internal bucket', () => {
    expect(throttleSubject({ request: internal(), policy })).toEqual({ tracker: THROTTLE_SUBJECT.internalTracker, isInternal: true });
    expect(throttleSubject({ request: internal({ [INTERNAL_REQUEST.clientIpHeader]: 'not-an-ip' }), policy }).isInternal).toBe(true);
  });

  it('ignores a forwarded address without the right token', () => {
    const spoofed = request({ headers: { [INTERNAL_REQUEST.tokenHeader]: 'guess', [INTERNAL_REQUEST.clientIpHeader]: '192.0.2.10' } });

    expect(throttleSubject({ request: spoofed, policy })).toEqual({ tracker: '203.0.113.7', isInternal: false });
  });

  it('refuses the token from a public peer that is not a trusted proxy', () => {
    const direct = { ...internal({ [INTERNAL_REQUEST.clientIpHeader]: '192.0.2.10' }), socket: { remoteAddress: '198.51.100.20' } };

    expect(throttleSubject({ request: direct, policy }).tracker).toBe('198.51.100.20');
    expect(throttleSubject({ request: direct, policy: { ...policy, trustedProxies: ['198.51.100.0/24'] } }).tracker).toBe('192.0.2.10');
  });

  it('groups IPv6 visitors by their /64', () => {
    const subject = throttleSubject({ request: internal({ [INTERNAL_REQUEST.clientIpHeader]: '2001:db8:1:2:aaaa::1' }), policy });

    expect(subject.tracker).toBe(
      throttleSubject({ request: internal({ [INTERNAL_REQUEST.clientIpHeader]: '2001:db8:1:2:bbbb::9' }), policy }).tracker
    );
  });
});

describe('isInternalToken', () => {
  it('accepts only the exact token', () => {
    expect(isInternalToken({ received: TOKEN, token: TOKEN })).toBe(true);
    expect(isInternalToken({ received: `${TOKEN}x`, token: TOKEN })).toBe(false);
    expect(isInternalToken({ received: '', token: TOKEN })).toBe(false);
    expect(isInternalToken({ received: undefined, token: TOKEN })).toBe(false);
  });
});

describe('isTrustedPeer', () => {
  it('trusts loopback and private peers, including IPv4-mapped ones', () => {
    expect(isTrustedPeer({ peer: '127.0.0.1', trustedProxies: [] })).toBe(true);
    expect(isTrustedPeer({ peer: '::ffff:172.18.0.3', trustedProxies: [] })).toBe(true);
    expect(isTrustedPeer({ peer: 'fd00::1', trustedProxies: [] })).toBe(true);
  });

  it('trusts a public peer only when it is a configured proxy', () => {
    expect(isTrustedPeer({ peer: '198.51.100.20', trustedProxies: [] })).toBe(false);
    expect(isTrustedPeer({ peer: '198.51.100.20', trustedProxies: ['198.51.100.20'] })).toBe(true);
    expect(isTrustedPeer({ peer: '2001:db8::5', trustedProxies: ['2001:db8::/32'] })).toBe(true);
    expect(isTrustedPeer({ peer: '2001:db8::5', trustedProxies: ['198.51.100.0/24', 'garbage/99'] })).toBe(false);
    expect(isTrustedPeer({ peer: undefined, trustedProxies: [] })).toBe(false);
  });
});

describe('forwardedClientIp', () => {
  it('takes the first address of the list and rejects anything else', () => {
    expect(forwardedClientIp(' 192.0.2.10 , 10.0.0.1')).toBe('192.0.2.10');
    expect(forwardedClientIp(['::ffff:192.0.2.10'])).toBe('192.0.2.10');
    expect(forwardedClientIp('nope')).toBeNull();
    expect(forwardedClientIp(undefined)).toBeNull();
  });
});
