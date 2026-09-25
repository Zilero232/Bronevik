import { describe, expect, it } from 'vitest';

import { challengeConditionSchema, overlayConfigSchema } from '../streamers.schemas';

describe('overlayConfigSchema', () => {
  it('fills defaults around the chosen metrics', () => {
    const config = overlayConfigSchema.parse({ metrics: ['wn8'] });

    expect(config.metrics).toEqual(['wn8']);
    expect(config.animate).toBe(true);
    expect(config.resetAt).toBe('session');
  });

  it('requires at least one metric', () => {
    expect(overlayConfigSchema.safeParse({ metrics: [] }).success).toBe(false);
  });

  it('rejects a malformed accent colour', () => {
    expect(overlayConfigSchema.safeParse({ metrics: ['wn8'], accentColor: 'orange' }).success).toBe(false);
  });
});

describe('challengeConditionSchema', () => {
  it('defaults to a single battle at or above the value', () => {
    const condition = challengeConditionSchema.parse({ metric: 'damage', value: 3000, tankType: 'lightTank' });

    expect(condition).toMatchObject({ operator: 'gte', battles: 1, aggregate: 'single' });
  });

  it('rejects an unknown vehicle type', () => {
    expect(challengeConditionSchema.safeParse({ metric: 'damage', value: 3000, tankType: 'tank' }).success).toBe(false);
  });
});
