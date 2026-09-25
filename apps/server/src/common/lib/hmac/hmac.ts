import { createHmac, timingSafeEqual as nodeTimingSafeEqual } from 'node:crypto';

import type { HmacInput, VerifySignatureInput } from './hmac.types';

import { HMAC } from './hmac.constants';

export const timingSafeEqual = (left: string, right: string): boolean => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);

  if (a.length !== b.length) {
    return false;
  }

  return nodeTimingSafeEqual(a, b);
};

export const hmacSha256Hex = ({ key, data }: HmacInput): string => createHmac(HMAC.algorithm, key).update(data).digest('hex');

export const verifySignatureHeader = ({ header, key, body }: VerifySignatureInput): boolean => {
  if (!header?.startsWith(HMAC.headerPrefix)) {
    return false;
  }

  const received = header.slice(HMAC.headerPrefix.length).trim().toLowerCase();

  if (!HMAC.hexPattern.test(received)) {
    return false;
  }

  return timingSafeEqual(received, hmacSha256Hex({ key, data: body }));
};
