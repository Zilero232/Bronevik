import type { CompareInput, HmacHexInput, VerifyWebhookInput } from './webhooks.types';

import { WEBHOOK_SIGNATURE } from './webhooks.constants';

const encoder = new TextEncoder();

const hmacHex = async ({ secret, data }: HmacHexInput): Promise<string> => {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));

  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const constantTimeEqual = ({ left, right }: CompareInput): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
};

export const verifyWebhookSignature = async ({
  secret,
  body,
  signature,
  timestamp,
  toleranceSec = WEBHOOK_SIGNATURE.toleranceSec,
  now = new Date()
}: VerifyWebhookInput): Promise<boolean> => {
  if (!signature?.startsWith(WEBHOOK_SIGNATURE.scheme) || !timestamp || !/^\d+$/.test(timestamp)) {
    return false;
  }

  if (Math.abs(now.getTime() / 1000 - Number(timestamp)) > toleranceSec) {
    return false;
  }

  const expected = await hmacHex({ secret, data: `${timestamp}.${body}` });

  return constantTimeEqual({ left: signature.slice(WEBHOOK_SIGNATURE.scheme.length).toLowerCase(), right: expected });
};
