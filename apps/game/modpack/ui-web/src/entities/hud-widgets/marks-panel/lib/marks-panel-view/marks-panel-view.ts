import type { MarksPanelData } from '../../model/schemas';
import type { MarksPanelView } from './marks-panel-view.types';

import { formatNumber, formatPercent } from '../../../../../shared/lib/hud-format';
import { MARKS_PANEL } from '../../config';

const arrow = (delta: number): string => (delta > 0 ? MARKS_PANEL.up : delta < 0 ? MARKS_PANEL.down : '');

export const marksPanelView = (data: MarksPanelData): MarksPanelView => ({
  extended: data.style === 'extended',
  mark: data.mark ?? MARKS_PANEL.fallbackMark,
  percent: data.percent === null ? '—' : formatPercent({ value: data.percent, digits: 2 }),
  delta:
    data.delta === null || data.style === 'minimal' ? null : `${arrow(data.delta)} ${formatPercent({ value: data.delta, digits: 2, signed: true })}`,
  deltaTone: (data.delta ?? 0) > 0 ? 'good' : (data.delta ?? 0) < 0 ? 'bad' : 'muted',
  thresholds: data.thresholds.map((item) => ({
    level: item.level,
    label: formatPercent({ value: item.level, digits: 0 }),
    value: item.reached ? MARKS_PANEL.check : formatNumber(item.need),
    reached: item.reached
  })),
  step: data.step ? `${formatPercent({ value: data.step.step, digits: 1, signed: true })}: ${formatNumber(data.step.need)}` : null,
  battles: data.battles ? `${formatPercent({ value: data.battles.level, digits: 0 })}: ~${formatNumber(data.battles.count)}` : null
});
