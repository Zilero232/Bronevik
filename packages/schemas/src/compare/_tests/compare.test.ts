import { describe, expect, it } from 'vitest';

import { COMPARE } from '../compare.constants';
import { playerComparisonQuerySchema, tankComparisonQuerySchema } from '../compare.schemas';

const ids = (count: number) => Array.from({ length: count }, (_, index) => String(index + 1)).join(',');

describe('playerComparisonQuerySchema', () => {
  it('accepts the minimum and maximum number of players', () => {
    expect(playerComparisonQuerySchema.safeParse({ accountIds: ids(COMPARE.minItems) }).success).toBe(true);
    expect(playerComparisonQuerySchema.safeParse({ accountIds: ids(COMPARE.maxPlayers) }).success).toBe(true);
  });

  it('rejects too few or too many players', () => {
    expect(playerComparisonQuerySchema.safeParse({ accountIds: ids(COMPARE.minItems - 1) }).success).toBe(false);
    expect(playerComparisonQuerySchema.safeParse({ accountIds: ids(COMPARE.maxPlayers + 1) }).success).toBe(false);
  });

  it('rejects the same player twice', () => {
    expect(playerComparisonQuerySchema.safeParse({ accountIds: '7,7' }).success).toBe(false);
  });
});

describe('tankComparisonQuerySchema', () => {
  it('rejects more tanks than the limit', () => {
    expect(tankComparisonQuerySchema.safeParse({ tankIds: ids(COMPARE.maxTanks + 1) }).success).toBe(false);
  });

  it('parses tank ids from a query string', () => {
    expect(tankComparisonQuerySchema.parse({ tankIds: '1,2' }).tankIds).toEqual([1, 2]);
  });
});
