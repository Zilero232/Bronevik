import { describe, expect, it } from 'vitest';

import { MODE_META } from '../modes.constants';
import { modeMetaQuerySchema, modeParamsSchema, myModeStatsQuerySchema } from '../modes.schemas';

describe('modes schemas', () => {
  it('defaults the sample floor and the personal window', () => {
    expect(modeMetaQuerySchema.parse({}).minBattles).toBe(MODE_META.minBattles);
    expect(myModeStatsQuerySchema.parse({}).days).toBe(MODE_META.myDefaultDays);
  });

  it('refuses an unknown mode and a window past the limit', () => {
    expect(modeParamsSchema.safeParse({ mode: 'random' }).success).toBe(false);
    expect(myModeStatsQuerySchema.safeParse({ days: MODE_META.myMaxDays + 1 }).success).toBe(false);
  });
});
