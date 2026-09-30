import type { HudTone } from '../../../../../shared/ui/hud';
import type { MarksPanelData } from '../../model/schemas';
import type { MarksPanelView } from './marks-panel-view.types';

import { formatNumber, formatPercent } from '../../../../../shared/lib/hud-format';
import { MARKS_PANEL } from '../../config';

const levelLabel = (level: number): string => formatPercent({ value: level, digits: 0 });

const needText = (need: number): string => (need > 0 ? formatNumber(need) : '');

const upView = (up: MarksPanelData['up']): MarksPanelView['up'] =>
  up === null ? null : { label: levelLabel(up.level), value: needText(up.need), reached: up.need === 0 };

const targetText = ({ level, target }: NonNullable<MarksPanelData['detail']>): string | null =>
  level === null || target === null ? null : `${levelLabel(level)}: ${formatNumber(target)}`;

const detailView = (detail: MarksPanelData['detail']): MarksPanelView['detail'] => {
  if (detail === null) {
    return null;
  }

  const average = `${formatNumber(detail.ema)} ${MARKS_PANEL.arrow} ${formatNumber(detail.ema_projected)}`;

  return { label: detail.label, average, target: targetText(detail) };
};

const percentText = (percent: number | null): string =>
  percent === null ? MARKS_PANEL.unknownPercent : formatPercent({ value: percent, digits: 2 });

const deltaText = ({ delta, style }: MarksPanelData): string | null =>
  delta === null || style === 'minimal' ? null : formatPercent({ value: delta, digits: 2, signed: true });

const deltaTone = (delta: number | null): HudTone => {
  const change = delta ?? 0;

  if (change > 0) {
    return MARKS_PANEL.deltaTones.rising;
  }

  return change < 0 ? MARKS_PANEL.deltaTones.falling : MARKS_PANEL.deltaTones.flat;
};

const thresholdsView = (thresholds: MarksPanelData['thresholds']): MarksPanelView['thresholds'] =>
  thresholds.map((item) => ({
    level: item.level,
    label: levelLabel(item.level),
    value: item.reached ? '' : formatNumber(item.need),
    reached: item.reached
  }));

const stepText = (step: MarksPanelData['step']): string | null =>
  step ? `${formatPercent({ value: step.step, digits: 1, signed: true })}: ${formatNumber(step.need)}` : null;

const battlesText = (battles: MarksPanelData['battles']): string | null =>
  battles ? `${levelLabel(battles.level)}: ~${formatNumber(battles.count)}` : null;

const sourceView = (source: MarksPanelData['source']): MarksPanelView['source'] =>
  source === null ? null : { label: source.label, tone: MARKS_PANEL.sourceTones[source.kind] };

export const marksPanelView = (data: MarksPanelData): MarksPanelView => {
  const extended = data.style === 'extended';
  const minimal = data.style === 'minimal';

  return {
    extended,
    mark: data.mark ?? MARKS_PANEL.fallbackMark,
    percent: percentText(data.percent),
    delta: deltaText(data),
    deltaTone: deltaTone(data.delta),
    thresholds: thresholdsView(data.thresholds),
    step: stepText(data.step),
    battles: battlesText(data.battles),
    up: minimal ? null : upView(data.up),
    source: sourceView(data.source),
    detail: extended ? detailView(data.detail) : null
  };
};
