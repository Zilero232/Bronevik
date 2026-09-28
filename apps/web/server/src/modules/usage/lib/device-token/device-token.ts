import type { HashIpInput, ReadDeviceTokenInput, SignDeviceTokenInput } from './device-token.types';

import { hmacSha256Hex, timingSafeEqual } from '../../../../common/lib';
import { USAGE_DEVICE } from '../../config';

const signatureOf = ({ deviceId, secret }: SignDeviceTokenInput): string =>
  hmacSha256Hex({ key: secret, data: `${USAGE_DEVICE.signingContext}${deviceId}` });

export const signDeviceToken = ({ deviceId, secret }: SignDeviceTokenInput): string =>
  `${deviceId}${USAGE_DEVICE.separator}${signatureOf({ deviceId, secret })}`;

export const readDeviceToken = ({ token, secret }: ReadDeviceTokenInput): string | null => {
  const [deviceId, signature, ...rest] = token?.split(USAGE_DEVICE.separator) ?? [];

  if (!deviceId || !signature || rest.length > 0) {
    return null;
  }

  return timingSafeEqual({ left: signature, right: signatureOf({ deviceId, secret }) }) ? deviceId : null;
};

export const hashIp = ({ ip, secret }: HashIpInput): string =>
  hmacSha256Hex({ key: secret, data: `${USAGE_DEVICE.ipContext}${ip}` }).slice(0, USAGE_DEVICE.ipHashLength);
