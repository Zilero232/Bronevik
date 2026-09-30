import { reverse } from 'remeda';

import type { TeamHpData, TeamHpVehicle } from '../../model/schemas';
import type {
  SegmentsInput,
  SideViewInput,
  TeamHpGap,
  TeamHpNumbers,
  TeamHpSegment,
  TeamHpSideView,
  TeamHpStripVehicle,
  TeamHpTierLabel,
  TeamHpView
} from './team-hp-view.types';

import { barFill } from '../../../../../shared/lib/hud-bar';
import { formatNumber, formatSigned } from '../../../../../shared/lib/hud-format';
import { TEAM_HP } from '../../config';

const startsTierGroup = (vehicle: TeamHpVehicle, index: number): boolean => index > 0 && vehicle.tier !== null;

const segmentsOf = ({ vehicles, width }: SegmentsInput): (TeamHpGap | TeamHpSegment)[] => {
  const total = vehicles.reduce((sum, vehicle) => sum + vehicle.max, 0);
  const gaps = vehicles.filter(startsTierGroup).length;
  const room = width - TEAM_HP.segmentGap * Math.max(0, vehicles.length - 1) - TEAM_HP.tierGap * gaps;

  return vehicles.flatMap((vehicle, index) => {
    const segmentWidth = total > 0 ? Math.max(2, Math.round((vehicle.max / total) * room)) : 0;
    const segment: TeamHpSegment = {
      kind: 'segment',
      key: `segment-${index}`,
      width: segmentWidth,
      fill: barFill({ value: vehicle.hp, max: vehicle.max, width: segmentWidth }),
      alive: vehicle.alive
    };

    return startsTierGroup(vehicle, index) ? [{ kind: 'gap', key: `gap-${index}` } satisfies TeamHpGap, segment] : [segment];
  });
};

const stripOf = (vehicles: TeamHpVehicle[]): (TeamHpStripVehicle | TeamHpTierLabel)[] =>
  vehicles.flatMap((vehicle, index) => {
    const item: TeamHpStripVehicle = {
      kind: 'vehicle',
      key: `vehicle-${index}`,
      icon: vehicle.icon,
      bar: barFill({ value: vehicle.hp, max: vehicle.max, width: TEAM_HP.iconBar.width }),
      alpha: vehicle.alive ? 1 : TEAM_HP.deadAlpha
    };

    return vehicle.tier === null ? [item] : [{ kind: 'tier', key: `tier-${index}`, label: vehicle.tier } satisfies TeamHpTierLabel, item];
  });

const sideView = ({ side, vehicles, width, mirrored }: SideViewInput): TeamHpSideView => {
  const segments = segmentsOf({ vehicles, width });
  const strip = stripOf(vehicles);

  return {
    hp: formatNumber(side.hp),
    fill: barFill({ value: side.hp, max: side.max, width }),
    segments: mirrored ? reverse(segments) : segments,
    strip: mirrored ? reverse(strip) : strip
  };
};

const widthOf = (style: TeamHpData['style']): number => {
  const widths: Partial<Record<TeamHpData['style'], number>> = TEAM_HP.barWidth;

  return widths[style] ?? 0;
};

const numbersOf = (style: TeamHpData['style']): TeamHpNumbers => {
  const labelled: readonly string[] = TEAM_HP.labelledStyles;
  const outside: readonly string[] = TEAM_HP.outsideNumberStyles;

  if (labelled.includes(style)) {
    return 'inside';
  }

  return outside.includes(style) ? 'outside' : 'none';
};

const barHeightOf = (style: TeamHpData['style'], numbers: TeamHpNumbers): number => {
  if (style === 'minimal') {
    return TEAM_HP.barHeight.thin;
  }

  return numbers === 'inside' ? TEAM_HP.barHeight.labelled : TEAM_HP.barHeight.plain;
};

const scoreOf = (data: TeamHpData): string => {
  const key = data.score_alive ? 'alive' : 'frags';

  return `${data.allies[key]} : ${data.enemies[key]}`;
};

export const teamHpView = (data: TeamHpData): TeamHpView => {
  const { style } = data;
  const barWidth = widthOf(style);
  const compact = style === 'compact' || style === 'minimal';
  const numbers = numbersOf(style);
  const score = data.show_score || compact ? scoreOf(data) : null;
  const diff = data.diff === null || compact ? null : formatSigned(data.diff);

  return {
    numbers,
    showBars: barWidth > 0,
    showStrip: style === 'icons',
    segmented: style === 'segments',
    barWidth,
    barHeight: barHeightOf(style, numbers),
    score,
    diff,
    diffAhead: (data.diff ?? 0) >= 0,
    hasCenter: score !== null || diff !== null,
    allies: sideView({ side: data.allies, vehicles: data.vehicles.allies, width: barWidth, mirrored: true }),
    enemies: sideView({ side: data.enemies, vehicles: data.vehicles.enemies, width: barWidth, mirrored: false }),
    colors: data.colors
  };
};
