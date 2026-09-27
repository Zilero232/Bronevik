import { describe, expect, it } from 'vitest';

import { urlBase64ToUint8Array } from '..';

const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const UNCOMPRESSED_POINT = { length: 65, prefix: 0x04 } as const;

const toUrlBase64 = (bytes: number[]) => Buffer.from(bytes).toString('base64url');

describe('urlBase64ToUint8Array', () => {
  it('decodes a VAPID public key into an uncompressed P-256 point', () => {
    const bytes = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    expect(bytes).toHaveLength(UNCOMPRESSED_POINT.length);
    expect(bytes[0]).toBe(UNCOMPRESSED_POINT.prefix);
  });

  it('restores the padding the url-safe alphabet strips', () => {
    [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]].forEach((bytes) => {
      expect([...urlBase64ToUint8Array(toUrlBase64(bytes))]).toEqual(bytes);
    });
  });

  it('maps the url-safe characters back to the standard alphabet', () => {
    const bytes = [251, 255, 191];

    expect(toUrlBase64(bytes)).toMatch(/[-_]/);
    expect([...urlBase64ToUint8Array(toUrlBase64(bytes))]).toEqual(bytes);
  });

  it('returns an empty array for an empty key', () => {
    expect(urlBase64ToUint8Array('')).toHaveLength(0);
  });
});
