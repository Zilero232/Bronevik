import { describe, expect, it } from 'vitest';

import type { HostLookup } from '../webhook-url.types';

import { isPublicAddress, isPublicWebhookUrl, publicAddressOf, resolvesPublicly } from '../webhook-url';

const resolvingTo =
  (...addresses: string[]): HostLookup =>
  async () =>
    addresses.map((address) => ({ address, family: address.includes(':') ? 6 : 4 }));

describe('isPublicAddress', () => {
  it('accepts public IPv4 and IPv6 unicast addresses', () => {
    expect(['93.184.216.34', '8.8.8.8', '2606:4700:4700::1111'].every(isPublicAddress)).toBe(true);
  });

  it('refuses every special-purpose range', () => {
    const special = [
      '127.0.0.1',
      '10.1.2.3',
      '172.20.0.1',
      '192.168.0.10',
      '169.254.169.254',
      '100.64.0.1',
      '0.0.0.0',
      '255.255.255.255',
      '224.0.0.1',
      '::1',
      '::',
      'fe80::1',
      'fd00::1',
      '::ffff:127.0.0.1',
      '::ffff:10.0.0.1'
    ];

    expect(special.filter(isPublicAddress)).toEqual([]);
  });

  it('refuses something that is not an address', () => {
    expect(isPublicAddress('example.com')).toBe(false);
  });
});

describe('isPublicWebhookUrl', () => {
  it('accepts a public https address', () => {
    expect(isPublicWebhookUrl('https://hooks.example.com/otmetki')).toBe(true);
  });

  it('refuses plain http', () => {
    expect(isPublicWebhookUrl('http://hooks.example.com/otmetki')).toBe(false);
  });

  it('refuses loopback, link-local and private literals and internal names', () => {
    const internal = [
      'https://localhost/hook',
      'https://api.localhost/hook',
      'https://127.0.0.1/hook',
      'https://0x7f.1/hook',
      'https://2130706433/hook',
      'https://10.1.2.3/hook',
      'https://169.254.169.254/latest/meta-data',
      'https://[::1]/hook',
      'https://[::ffff:7f00:1]/hook',
      'https://printer.local/hook',
      'https://metadata.google.internal/hook'
    ];

    expect(internal.filter(isPublicWebhookUrl)).toEqual([]);
  });

  it('refuses something that is not a URL', () => {
    expect(isPublicWebhookUrl('not a url')).toBe(false);
  });
});

describe('resolvesPublicly', () => {
  it('accepts a host whose every address is public', async () => {
    expect(await resolvesPublicly({ url: 'https://hooks.example.com/x', lookup: resolvingTo('93.184.216.34', '2606:4700:4700::1111') })).toBe(true);
  });

  it('refuses a public name that resolves to a private address', async () => {
    expect(await resolvesPublicly({ url: 'https://rebind.example.com/x', lookup: resolvingTo('93.184.216.34', '10.0.0.5') })).toBe(false);
  });

  it('refuses a host that does not resolve', async () => {
    const failing: HostLookup = async () => {
      throw new Error('ENOTFOUND');
    };

    expect(await resolvesPublicly({ url: 'https://missing.example.com/x', lookup: failing })).toBe(false);
    expect(await resolvesPublicly({ url: 'https://empty.example.com/x', lookup: resolvingTo() })).toBe(false);
  });

  it('trusts a public literal without a lookup and refuses a private one', async () => {
    const unexpected: HostLookup = async () => {
      throw new Error('should not look up a literal');
    };

    expect(await resolvesPublicly({ url: 'https://93.184.216.34/x', lookup: unexpected })).toBe(true);
    expect(await resolvesPublicly({ url: 'https://127.0.0.1/x', lookup: unexpected })).toBe(false);
  });
});

describe('publicAddressOf', () => {
  it('returns the validated address the delivery connects to, so a second lookup cannot rebind it', async () => {
    expect(await publicAddressOf({ url: 'https://hooks.example.com/x', lookup: resolvingTo('93.184.216.34') })).toBe('93.184.216.34');
    expect(await publicAddressOf({ url: 'https://rebind.example.com/x', lookup: resolvingTo('10.0.0.5') })).toBeNull();
  });
});
