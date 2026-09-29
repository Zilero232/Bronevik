import { fromUnixTime, isValid, lightFormat } from 'date-fns';
import { clamp } from 'remeda';

import type { MarksReportView, ReportCard, ReportRow, ReportTone, UiMarksReport } from './marks-report.types';

import { formatNumber, formatPercent } from '../../../../shared/lib/hud-format';
import { MARKS_REPORT } from './marks-report.constants';

const toneOf = (delta: number | null): ReportTone => ((delta ?? 0) > 0 ? 'good' : (delta ?? 0) < 0 ? 'bad' : 'muted');

const deltaText = (delta: number | null): string => (delta === null ? MARKS_REPORT.dash : formatPercent({ value: delta, digits: 2, signed: true }));

const percentText = (value: number | null): string => (value === null ? MARKS_REPORT.dash : formatPercent({ value, digits: 2 }));

const reportDate = (seconds: number | null): string => {
  const date = seconds === null ? null : fromUnixTime(seconds);

  return date && isValid(date) ? lightFormat(date, MARKS_REPORT.dateFormat) : MARKS_REPORT.dash;
};

const chartOf = (values: number[]): MarksReportView['chart'] => {
  if (values.length < 2) {
    return null;
  }

  const { width, height, padding } = MARKS_REPORT.chart;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, MARKS_REPORT.minSpan);
  const step = (width - padding * 2) / (values.length - 1);
  const points = values.map(
    (value, index) => `${(padding + index * step).toFixed(1)},${(height - padding - ((value - min) / span) * (height - padding * 2)).toFixed(1)}`
  );

  return { points: points.join(' '), min: percentText(min), max: percentText(max) };
};

const cardsOf = (report: UiMarksReport): ReportCard[] => {
  const cards: ReportCard[] = [];

  if (report.last) {
    cards.push({
      key: 'last',
      label: 'last',
      window: null,
      value: formatNumber(report.last.damage ?? 0),
      delta: deltaText(report.last.delta),
      tone: toneOf(report.last.delta)
    });
  }

  if (report.best) {
    cards.push({
      key: 'best',
      label: 'best',
      window: null,
      value: formatNumber(report.best.damage ?? 0),
      delta: deltaText(report.best.delta),
      tone: toneOf(report.best.delta)
    });
  }

  report.trends.forEach((trend) =>
    cards.push({
      key: `trend-${trend.window}`,
      label: 'trend',
      window: trend.window,
      value: String(trend.battles),
      delta: deltaText(trend.delta),
      tone: toneOf(trend.delta)
    })
  );

  return cards;
};

export const marksReportView = (report: UiMarksReport): MarksReportView => ({
  percent: percentText(report.percent),
  progress: `${clamp(report.percent ?? 0, { min: 0, max: 100 })}%`,
  cards: cardsOf(report),
  rows: report.battles.map((battle, index): ReportRow => ({
    key: `${battle.t ?? index}-${index}`,
    date: reportDate(battle.t),
    damage: formatNumber(battle.damage ?? 0),
    percent: percentText(battle.percent),
    delta: deltaText(battle.delta),
    tone: toneOf(battle.delta)
  })),
  chart: chartOf(report.chart)
});
