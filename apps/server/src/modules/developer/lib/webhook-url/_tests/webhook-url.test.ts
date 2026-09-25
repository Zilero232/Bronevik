import { describe, expect, it } from 'vitest';

import { isPublicWebhookUrl } from '../webhook-url';

describe('isPublicWebhookUrl', () => {
  it('accepts a public https address', () => {
    expect(isPublicWebhookUrl('https://hooks.example.com/bronevik')).toBe(true);
  });

  it('refuses plain http', () => {
    expect(isPublicWebhookUrl('http://hooks.example.com/bronevik')).toBe(false);
  });

  it('refuses loopback, link-local and private networks', () => {
    const internal = [
      'https://localhost/hook',
      'https://127.0.0.1/hook',
      'https://10.1.2.3/hook',
      'https://172.20.0.1/hook',
      'https://192.168.0.10/hook',
      'https://169.254.169.254/latest/meta-data',
      'https://[::1]/hook',
      'https://printer.local/hook'
    ];

    expect(internal.filter(isPublicWebhookUrl)).toEqual([]);
  });

  it('refuses something that is not a URL', () => {
    expect(isPublicWebhookUrl('not a url')).toBe(false);
  });
});
