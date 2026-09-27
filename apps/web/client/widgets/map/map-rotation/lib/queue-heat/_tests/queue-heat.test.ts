import { describe, expect, it } from 'vitest';

import type { QueueCell } from '../../../api';

import { MAP_STATS } from '../../../config';
import { queueHeat, waitTone } from '../queue-heat';

const MIN_SAMPLES = 5;

const cell = (tier: number, hour: number, medianSec: number, samples = MIN_SAMPLES): QueueCell => ({
  tier,
  hour,
  samples,
  avgSec: medianSec,
  medianSec,
  p90Sec: medianSec * 2
});

const tones = MAP_STATS.waitTones;

describe('waitTone', () => {
  it('gives the shortest wait the best tone and the longest the worst', () => {
    expect(waitTone({ value: 10, min: 10, max: 90, tones })).toBe(tones[0]);
    expect(waitTone({ value: 90, min: 10, max: 90, tones })).toBe(tones.at(-1));
  });

  it('never ranks a longer wait better than a shorter one', () => {
    const order = [10, 25, 40, 55, 70, 90].map((value) => {
      const tone = waitTone({ value, min: 10, max: 90, tones });

      return tones.findIndex((entry) => entry === tone);
    });

    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('lands in the middle when every wait is the same', () => {
    expect(waitTone({ value: 30, min: 30, max: 30, tones })).toBe(tones[Math.floor(tones.length / 2)]);
  });
});

describe('queueHeat', () => {
  const heat = queueHeat({
    cells: [cell(10, 20, 60), cell(10, 4, 20), cell(MAP_STATS.allTiers, 20, 40), cell(6, 12, 99, MIN_SAMPLES - 1)],
    minSamples: MIN_SAMPLES,
    hours: MAP_STATS.hours,
    tones
  });

  it('builds a full day for every tier with enough samples, overall first', () => {
    expect(heat.rows.map((row) => row.tier)).toEqual([MAP_STATS.allTiers, 10]);
    expect(heat.rows.every((row) => row.cells.length === MAP_STATS.hours)).toBe(true);
  });

  it('leaves hours without data empty', () => {
    const tenth = heat.rows.find((row) => row.tier === 10);

    expect(tenth?.cells[0]).toEqual({ hour: 0, cell: null, tone: null });
  });

  it('ignores thin samples when finding the range', () => {
    expect(heat.fastestSec).toBe(20);
    expect(heat.slowestSec).toBe(60);
  });

  it('is empty when nothing has enough samples', () => {
    expect(queueHeat({ cells: [cell(10, 1, 30, 0)], minSamples: MIN_SAMPLES, hours: MAP_STATS.hours, tones })).toEqual({
      rows: [],
      fastestSec: null,
      slowestSec: null
    });
  });
});
