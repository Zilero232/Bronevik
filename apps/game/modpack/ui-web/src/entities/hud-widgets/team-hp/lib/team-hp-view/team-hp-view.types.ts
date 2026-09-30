import type { TeamHpData, TeamHpVehicle } from '../../model/schemas';

export type TeamHpSegment = { kind: 'segment'; key: string; width: number; fill: number; alive: boolean };

export type TeamHpGap = { kind: 'gap'; key: string };

export type TeamHpStripVehicle = { kind: 'vehicle'; key: string; icon: TeamHpVehicle['icon']; bar: number; alpha: number };

export type TeamHpTierLabel = { kind: 'tier'; key: string; label: string };

export type TeamHpSideView = {
  hp: string;
  fill: number;
  segments: (TeamHpGap | TeamHpSegment)[];
  strip: (TeamHpStripVehicle | TeamHpTierLabel)[];
};

export type TeamHpView = {
  showNumbers: boolean;
  showBars: boolean;
  showStrip: boolean;
  segmented: boolean;
  compact: boolean;
  barWidth: number;
  barHeight: number;
  score: string | null;
  diff: string | null;
  diffAhead: boolean;
  allies: TeamHpSideView;
  enemies: TeamHpSideView;
  colors: TeamHpData['colors'];
};

export type SideViewInput = { side: TeamHpData['allies']; vehicles: TeamHpVehicle[]; width: number; mirrored: boolean };

export type SegmentsInput = { vehicles: TeamHpVehicle[]; width: number };
