import { RECENT_PERIODS } from '@bronevik/ratings';
import { playerComparisonSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { MOCK_PLAYERS } from '@/shared/mocks';

import { mockComparison } from '../compare.mock';

const IDS = MOCK_PLAYERS.slice(0, 3).map(({ id }) => id);

describe('mockComparison', () => {
  it('answers in the contract shape', () => {
    expect(() => playerComparisonSchema.parse(mockComparison(IDS))).not.toThrow();
  });

  it('keeps the requested player order', () => {
    expect(mockComparison(IDS).players.map(({ summary }) => summary.accountId)).toEqual(IDS);
  });

  it('carries every recent period so the page can pick one client-side', () => {
    mockComparison(IDS).players.forEach(({ recent }) => {
      expect(recent.map(({ period }) => period)).toEqual([...RECENT_PERIODS]);
    });
  });
});
