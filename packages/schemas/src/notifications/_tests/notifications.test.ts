import { describe, expect, it } from 'vitest';

import { quietHoursSchema, updateNotificationSettingsSchema } from '../notifications.schemas';

describe('notification schemas', () => {
  it('accepts quiet hours that wrap past midnight', () => {
    expect(quietHoursSchema.safeParse({ start: 23, end: 7 }).success).toBe(true);
  });

  it('rejects quiet hours that start and end together or leave the day', () => {
    expect(quietHoursSchema.safeParse({ start: 5, end: 5 }).success).toBe(false);
    expect(quietHoursSchema.safeParse({ start: 24, end: 1 }).success).toBe(false);
  });

  it('lets a settings update carry any subset of fields', () => {
    expect(updateNotificationSettingsSchema.parse({ weeklyDigest: false })).toEqual({ weeklyDigest: false });
  });
});
