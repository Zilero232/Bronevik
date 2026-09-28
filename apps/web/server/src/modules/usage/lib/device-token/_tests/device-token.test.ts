import { describe, expect, it } from 'vitest';

import { USAGE_DEVICE } from '../../../config';
import { hashIp, readDeviceToken, signDeviceToken } from '../device-token';

const SECRET = 'test-secret';

describe('readDeviceToken', () => {
  it('reads back the device id it signed', () => {
    expect(readDeviceToken({ token: signDeviceToken({ deviceId: 'device-1', secret: SECRET }), secret: SECRET })).toBe('device-1');
  });

  it('refuses a token signed with another secret', () => {
    expect(readDeviceToken({ token: signDeviceToken({ deviceId: 'device-1', secret: 'other' }), secret: SECRET })).toBeNull();
  });

  it('refuses a token whose device id was swapped', () => {
    const [, signature] = signDeviceToken({ deviceId: 'device-1', secret: SECRET }).split(USAGE_DEVICE.separator);

    expect(readDeviceToken({ token: `device-2${USAGE_DEVICE.separator}${signature}`, secret: SECRET })).toBeNull();
  });

  it('refuses a missing, unsigned or over-segmented token', () => {
    expect(readDeviceToken({ token: undefined, secret: SECRET })).toBeNull();
    expect(readDeviceToken({ token: 'device-1', secret: SECRET })).toBeNull();

    expect(
      readDeviceToken({ token: `${signDeviceToken({ deviceId: 'device-1', secret: SECRET })}${USAGE_DEVICE.separator}x`, secret: SECRET })
    ).toBeNull();
  });
});

describe('hashIp', () => {
  it('keeps the same address in the same fixed-length bucket', () => {
    const hashed = hashIp({ ip: '203.0.113.7', secret: SECRET });

    expect(hashed).toBe(hashIp({ ip: '203.0.113.7', secret: SECRET }));
    expect(hashed).toHaveLength(USAGE_DEVICE.ipHashLength);
  });

  it('puts different addresses in different buckets', () => {
    expect(hashIp({ ip: '203.0.113.7', secret: SECRET })).not.toBe(hashIp({ ip: '203.0.113.8', secret: SECRET }));
  });
});
