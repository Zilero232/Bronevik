import { describe, expect, it } from 'vitest';

import type { HistorySourceRow } from '../moe-history.types';

import { THRESHOLD_SOURCE_PRIORITY } from '../../../../reference';
import { historySeries } from '../moe-history';

const [best = '', worse = ''] = THRESHOLD_SOURCE_PRIORITY;
const worst = THRESHOLD_SOURCE_PRIORITY.at(-1) ?? '';

const row = ({ tankId = 1, date = '2026-09-01', source = worst, p65 = 2_000 }: Partial<HistorySourceRow>): HistorySourceRow => ({
  tankId,
  date,
  source,
  p65,
  p85: p65 + 500,
  p95: p65 + 1_000,
  p100: null
});

describe('historySeries', () => {
  it('picks the source with the best priority per date', () => {
    const [series] = historySeries({
      rows: [row({ source: worse, p65: 1 }), row({ source: best, p65: 2 }), row({ source: worst, p65: 3 })],
      tankIds: [1]
    });

    expect(series?.points.map((point) => point.p65)).toEqual([2]);
  });

  it('ranks an unknown source below every known one', () => {
    const [series] = historySeries({ rows: [row({ source: 'unknown', p65: 1 }), row({ source: worst, p65: 2 })], tankIds: [1] });

    expect(series?.points.map((point) => point.p65)).toEqual([2]);
  });

  it('sorts points by date and drops the source', () => {
    const [series] = historySeries({ rows: [row({ date: '2026-09-03' }), row({ date: '2026-09-01' })], tankIds: [1] });

    expect(series?.points.map((point) => point.date)).toEqual(['2026-09-01', '2026-09-03']);
    expect(series?.points[0]).not.toHaveProperty('source');
  });

  it('keeps the requested tank order and gives an unknown tank an empty series', () => {
    const series = historySeries({ rows: [row({ tankId: 1 }), row({ tankId: 2 })], tankIds: [2, 3, 1] });

    expect(series.map((item) => item.tankId)).toEqual([2, 3, 1]);
    expect(series[1]?.points).toEqual([]);
  });
});
