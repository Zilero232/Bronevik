import type { MarksPanelData } from '../../model/schemas';
import type { MarksPanelView } from './marks-panel-view.types';

import { formatNumber, formatPercent } from '../../../../../shared/lib/hud-format';
import { MARKS_PANEL } from '../../config';

const levelLabel = (level: number): string => formatPercent({ value: level, digits: 0 });

const upView = (up: MarksPanelData['up']): MarksPanelView['up'] =>
  up === null ? null : { label: levelLabel(up.level), value: up.need > 0 ? formatNumber(up.need) : '', reached: up.need === 0 };

const detailView = (detail: MarksPanelData['detail']): MarksPanelView['detail'] =>
  detail === null
    ? null
    : {
        label: detail.label,
        average: `${formatNumber(detail.ema)} ${MARKS_PANEL.arrow} ${formatNumber(detail.ema_projected)}`,
        target: detail.level === null || detail.target === null ? null : `${levelLabel(detail.level)}: ${formatNumber(detail.target)}`
      };

export const marksPanelView = (data: MarksPanelData): MarksPanelView => ({
  extended: data.style === 'extended',
  mark: data.mark ?? MARKS_PANEL.fallbackMark,
  percent: data.percent === null ? '—' : formatPercent({ value: data.percent, digits: 2 }),
  delta: data.delta === null || data.style === 'minimal' ? null : formatPercent({ value: data.delta, digits: 2, signed: true }),
  deltaTone: (data.delta ?? 0) > 0 ? 'good' : (data.delta ?? 0) < 0 ? 'bad' : 'muted',
  thresholds: data.thresholds.map((item) => ({
    level: item.level,
    label: levelLabel(item.level),
    value: item.reached ? '' : formatNumber(item.need),
    reached: item.reached
  })),
  step: data.step ? `${formatPercent({ value: data.step.step, digits: 1, signed: true })}: ${formatNumber(data.step.need)}` : null,
  battles: data.battles ? `${levelLabel(data.battles.level)}: ~${formatNumber(data.battles.count)}` : null,
  up: data.style === 'minimal' ? null : upView(data.up),
  source: data.source === null ? null : { label: data.source.label, tone: MARKS_PANEL.sourceTones[data.source.kind] },
  detail: data.style === 'extended' ? detailView(data.detail) : null
});
