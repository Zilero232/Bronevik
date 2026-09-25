import { moeHistoryBatchSchema, moeHistorySchema, moePageSchema, moeProjectionSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { MOCK_VEHICLES } from '@/shared/mocks';

import { mockMoeHistory, mockMoeHistoryBatch, mockMoeList, mockMoeProjection } from '../marks.mock';

const [TANK, OTHER] = MOCK_VEHICLES;

describe('marks mocks', () => {
  it('answer every endpoint in the shape the API contract promises', () => {
    expect(() => moePageSchema.parse(mockMoeList({}))).not.toThrow();
    expect(() => moeHistorySchema.parse(mockMoeHistory({ tankId: TANK.id }))).not.toThrow();
    expect(() => moeHistoryBatchSchema.parse(mockMoeHistoryBatch({ tankIds: [TANK.id, OTHER.id] }))).not.toThrow();

    expect(() =>
      moeProjectionSchema.parse(mockMoeProjection({ tankId: TANK.id, currentPercent: 70, targetMarks: 3, avgDamage: 3_000 }))
    ).not.toThrow();
  });

  it('return one series per known tank, each covering the asked days', () => {
    const days = 12;
    const { series } = mockMoeHistoryBatch({ tankIds: [TANK.id, OTHER.id, -1], days });

    expect(series.map(({ tankId }) => tankId)).toEqual([TANK.id, OTHER.id]);
    series.forEach(({ points }) => expect(points).toHaveLength(days));
  });

  it('narrow the list to the searched name', () => {
    const { items } = mockMoeList({ search: TANK.name });

    expect(items.every(({ vehicle }) => vehicle.name.toLowerCase().includes(TANK.name.toLowerCase()))).toBe(true);
  });
});
