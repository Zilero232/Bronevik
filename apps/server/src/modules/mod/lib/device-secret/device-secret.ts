import { createHash, createHmac, randomBytes, randomInt } from 'node:crypto';

import type { DeviceSecretInput, MatchesSecretHashInput } from './device-secret.types';

import { timingSafeEqual } from '../../../../common/lib';
import { BIND_CODE, MOD_DEVICE } from '../../config';

export const deviceSecret = ({ deviceId, serverSecret }: DeviceSecretInput): string =>
  createHmac('sha256', serverSecret).update(`${MOD_DEVICE.secretContext}${deviceId}`).digest('base64url');

export const hashSecret = (secret: string): string => createHash('sha256').update(secret).digest('hex');

export const matchesSecretHash = ({ secret, hash }: MatchesSecretHashInput): boolean => timingSafeEqual(hashSecret(secret), hash);

export const newDeviceId = (): string => `${MOD_DEVICE.idPrefix}${randomBytes(MOD_DEVICE.idBytes).toString('base64url')}`;

export const newBindCode = (): string =>
  Array.from({ length: BIND_CODE.length }, () => BIND_CODE.alphabet[randomInt(BIND_CODE.alphabet.length)]).join('');

export const normalizeBindCode = (code: string): string => code.replace(/[\s-]/g, '').toUpperCase();
