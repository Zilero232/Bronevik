export const HMAC = {
  algorithm: 'sha256',
  headerPrefix: 'sha256=',
  hexPattern: /^[0-9a-f]{64}$/
} as const;
