import { overlayConfigSchema, overlayMetricSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { OverlayData } from '@/shared/api/streamers';

import { RATING_TONES } from '@/shared/lib';

import { formatOverlayValue, readOverlayMetric } from '../overlay-metric';
import { OVERLAY_VALUE } from '../overlay-metric.constants';

const DATA: OverlayData = {
  kind: 'session',
  name: 'Session',
  config: overlayConfigSchema.parse({ metrics: ['battles'] }),
  player: { accountId: 1, nickname: 'Tester' },
  session: {
    battles: 12,
    wins: 7,
    winRate: 58.33,
    avgDamage: 3_120,
    frags: 15,
    wn8: 2_950,
    broneIndex: 1_420,
    winStreak: 3,
    lastBattle: { tankId: 1, tankName: 'T-34', result: 'loss', damage: 1_800 }
  },
  overall: null,
  moe: { tankName: 'T-34', marks: 2, percent: 87.6 },
  challenge: null,
  updatedAt: '2026-09-25T10:00:00.000Z'
};

const EMPTY: OverlayData = { ...DATA, session: null, moe: null };

describe('readOverlayMetric', () => {
  it('reads the session Bronya index', () => {
    expect(readOverlayMetric({ data: DATA, metric: 'broneIndex' }).value).toBe(DATA.session?.broneIndex);
  });

  it('reads every metric the contract allows', () => {
    overlayMetricSchema.options.forEach((metric) => {
      expect(readOverlayMetric({ data: DATA, metric }).metric).toBe(metric);
    });
  });

  it('reports no value for any metric before the first battle of the session', () => {
    overlayMetricSchema.options.forEach((metric) => {
      expect(readOverlayMetric({ data: EMPTY, metric }).value).toBeNull();
    });
  });

  it('colours win rate and WN8 with a rating tone, and nothing else', () => {
    const toned = overlayMetricSchema.options.filter((metric) => readOverlayMetric({ data: DATA, metric }).tone !== null);

    expect(toned.sort()).toEqual(['winRate', 'wn8']);
    toned.forEach((metric) => expect(RATING_TONES).toContain(readOverlayMetric({ data: DATA, metric }).tone));
  });

  it('carries the last battle result only on the last-battle metric', () => {
    const withResult = overlayMetricSchema.options.filter((metric) => readOverlayMetric({ data: DATA, metric }).result !== null);

    expect(withResult).toEqual(['lastBattle']);
    expect(readOverlayMetric({ data: DATA, metric: 'lastBattle' }).result).toBe(DATA.session?.lastBattle?.result);
  });

  it('reads the MoE percent from the tracked tank, not from the session', () => {
    expect(readOverlayMetric({ data: DATA, metric: 'moePercent' }).value).toBe(DATA.moe?.percent);
  });
});

describe('formatOverlayValue', () => {
  it('shows the placeholder for a missing value', () => {
    expect(formatOverlayValue({ value: null, kind: 'count', locale: 'en' })).toBe(OVERLAY_VALUE.placeholder);
  });

  it('keeps one decimal and the percent suffix for percentages', () => {
    const text = formatOverlayValue({ value: 58.33, kind: 'percent', locale: 'en' });

    expect(text.endsWith(OVERLAY_VALUE.suffix.percent)).toBe(true);
    expect(text).toContain('58.3');
  });

  it('rounds counts to whole numbers', () => {
    expect(formatOverlayValue({ value: 3_120.6, kind: 'count', locale: 'en' })).toBe(new Intl.NumberFormat('en').format(3_121));
  });

  it('groups digits by the requested locale', () => {
    expect(formatOverlayValue({ value: 12_345, kind: 'count', locale: 'ru' })).not.toBe(
      formatOverlayValue({ value: 12_345, kind: 'count', locale: 'en' })
    );
  });
});
