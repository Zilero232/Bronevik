import { describe, expect, it } from 'vitest';

import { ogLabels } from '../../og-labels';
import { playerOgMetrics, sessionOgDate, sessionOgMetrics } from '../og-metrics';

const stats = { battles: 12_345, winRate: 55.5, avgDamage: 2_100, wn8: { value: 2_450, tier: null }, broneIndex: { value: null, tier: null } };

const valueOf = (metrics: { key: string; value: string }[], key: string) => metrics.find((metric) => metric.key === key)?.value;

describe('playerOgMetrics', () => {
  it('formats numbers in the requested locale', () => {
    const metrics = playerOgMetrics({ stats, labels: ogLabels('en').player, locale: 'en' });

    expect(valueOf(metrics, 'battles')).toBe('12,345');
    expect(valueOf(metrics, 'winRate')).toBe('55.5%');
  });

  it('shows a dash for a missing rating', () => {
    expect(valueOf(playerOgMetrics({ stats, labels: ogLabels('ru').player, locale: 'ru' }), 'broneIndex')).toBe('—');
  });
});

describe('sessionOgMetrics', () => {
  it('lists battles, win rate, damage and WN8', () => {
    expect(sessionOgMetrics({ stats, labels: ogLabels('en').session, locale: 'en' }).map(({ key }) => key)).toEqual([
      'battles',
      'winRate',
      'avgDamage',
      'wn8'
    ]);
  });
});

describe('sessionOgDate', () => {
  it('writes the date in the locale', () => {
    expect(sessionOgDate({ startedAt: '2026-03-08T12:00:00Z', locale: 'en' })).toBe('March 8, 2026');
  });
});
