import { createHmac, timingSafeEqual as nodeTimingSafeEqual } from 'node:crypto';

import type { HmacInput, TimingSafeEqualInput, VerifySignatureInput } from './hmac.types';

import { HMAC } from './hmac.constants';

export const timingSafeEqual = ({ left, right }: TimingSafeEqualInput): boolean => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);

  if (a.length !== b.length) {
    return false;
  }

  return nodeTimingSafeEqual(a, b);
};

export const hmacSha256Hex = ({ key, data }: HmacInput): string => createHmac(HMAC.algorithm, key).update(data).digest('hex');

const signatureOf = (header: string | undefined): string | null => {
  if (!header?.startsWith(HMAC.headerPrefix)) {
    return null;
  }

  const received = header.slice(HMAC.headerPrefix.length).trim().toLowerCase();

  return HMAC.hexPattern.test(received) ? received : null;
};

export const isSignatureHeader = (header: string | undefined): boolean => signatureOf(header) !== null;

export const verifySignatureHeader = ({ header, key, body }: VerifySignatureInput): boolean => {
  const received = signatureOf(header);

  return received !== null && timingSafeEqual({ left: received, right: hmacSha256Hex({ key, data: body }) });
};
