import type { TeamHpData, TeamHpSide, TeamHpVehicle } from '../../model/schemas';
import type { TeamHpSegment, TeamHpSideView, TeamHpView } from './team-hp-view.types';

import { barFill } from '../../../../../shared/lib/hud-bar';
import { formatNumber, formatSigned } from '../../../../../shared/lib/hud-format';
import { TEAM_HP } from '../../config';

const segmentsOf = (vehicles: TeamHpVehicle[], width: number): TeamHpSegment[] => {
  const total = vehicles.reduce((sum, vehicle) => sum + vehicle.max, 0);
  const room = width - TEAM_HP.segmentGap * Math.max(0, vehicles.length - 1);

  return vehicles.map((vehicle, key) => {
    const segment = total > 0 ? Math.max(2, Math.round((vehicle.max / total) * room)) : 0;

    return { key, width: segment, fill: barFill({ value: vehicle.hp, max: vehicle.max, width: segment }), alive: vehicle.alive };
  });
};

const sideView = (side: TeamHpSide, vehicles: TeamHpVehicle[], width: number): TeamHpSideView => ({
  hp: formatNumber(side.hp),
  fill: barFill({ value: side.hp, max: side.max, width }),
  segments: segmentsOf(vehicles, width),
  vehicles: vehicles.map((vehicle, key) => ({
    ...vehicle,
    key,
    bar: barFill({ value: vehicle.hp, max: vehicle.max, width: TEAM_HP.iconBar.width }),
    alpha: vehicle.alive ? 1 : TEAM_HP.deadAlpha
  }))
});

const widthOf = (style: TeamHpData['style']): number => {
  const widths: Partial<Record<TeamHpData['style'], number>> = TEAM_HP.barWidth;

  return widths[style] ?? 0;
};

export const teamHpView = (data: TeamHpData): TeamHpView => {
  const { style } = data;
  const barWidth = widthOf(style);
  const compact = style === 'compact' || style === 'minimal';

  return {
    showNumbers: style !== 'bars' && style !== 'minimal' && style !== 'segments',
    showBars: barWidth > 0,
    showStrip: style === 'icons',
    segmented: style === 'segments',
    compact,
    barWidth,
    barHeight: style === 'minimal' ? TEAM_HP.barHeight.thin : TEAM_HP.barHeight.regular,
    score: data.show_score || compact ? `${data.allies.frags} : ${data.enemies.frags}` : null,
    diff: data.diff === null || compact ? null : formatSigned(data.diff),
    diffAhead: (data.diff ?? 0) >= 0,
    allies: sideView(data.allies, data.vehicles.allies, barWidth),
    enemies: sideView(data.enemies, data.vehicles.enemies, barWidth),
    colors: data.colors
  };
};
