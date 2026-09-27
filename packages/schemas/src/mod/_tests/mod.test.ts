import { describe, expect, it } from 'vitest';

import { MOD_RATINGS } from '../mod.constants';
import { modRatingsRequestSchema, modTankRatingsRequestSchema } from '../mod.schemas';

const device = { device_id: 'dev_Q2xhdWRlQm9uZA', account_id: 12_345 };

describe('modRatingsRequestSchema', () => {
  it('accepts the device id format the bind endpoint issues', () => {
    expect(modRatingsRequestSchema.safeParse(device).success).toBe(true);
  });

  it('refuses a body carrying anything beyond the device and its account', () => {
    expect(modRatingsRequestSchema.safeParse({ ...device, other_account_id: 1 }).success).toBe(false);
  });

  it('refuses a device id with characters outside the issued alphabet', () => {
    expect(modRatingsRequestSchema.safeParse({ ...device, device_id: 'dev/../x' }).success).toBe(false);
  });
});

describe('modTankRatingsRequestSchema', () => {
  const ids = (count: number) => Array.from({ length: count }, (_, index) => index + 1);

  it('accepts up to the tank limit', () => {
    expect(modTankRatingsRequestSchema.safeParse({ ...device, tank_ids: ids(MOD_RATINGS.maxTanks) }).success).toBe(true);
  });

  it('refuses an empty list and one past the limit', () => {
    expect(modTankRatingsRequestSchema.safeParse({ ...device, tank_ids: [] }).success).toBe(false);
    expect(modTankRatingsRequestSchema.safeParse({ ...device, tank_ids: ids(MOD_RATINGS.maxTanks + 1) }).success).toBe(false);
  });
});
