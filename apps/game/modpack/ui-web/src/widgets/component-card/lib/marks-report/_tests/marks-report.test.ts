import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { marksReportSchema } from '../../../../../shared/api/protocol';
import { marksReportView } from '../marks-report';

const report = marksReportSchema.parse(
  JSON.parse(readFileSync(path.resolve(import.meta.dirname, '../../../../../shared/api/protocol/_tests/fixtures/marks-report.sample.json'), 'utf8'))
);

describe(marksReportView, () => {
  it('builds the header, the cards and the table from the own marks history', () => {
    const view = marksReportView(report);

    expect(view.percent).toBe('85,20 %');
    expect(view.progress).toBe('85.2%');
    expect(view.cards.map((card) => card.key)).toEqual(['last', 'best', 'trend-10', 'trend-25']);
    expect(view.cards[1]).toMatchObject({ value: '4 500', delta: '+1,80 %', tone: 'good' });
    expect(view.rows[1]).toMatchObject({ damage: '2 300', delta: '-0,15 %', tone: 'bad' });
    expect(view.rows.at(-1)?.delta).toBe('—');
  });

  it('draws the chart across the percents and skips it for one point', () => {
    const view = marksReportView(report);

    expect(view.chart?.bars).toHaveLength(7);
    expect(view.chart?.min).toBe('80,12 %');
    expect(marksReportView({ ...report, chart: [80] }).chart).toBeNull();
  });
});
