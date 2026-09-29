import type { TeamHpData, TeamHpVehicle } from '../../model/schemas';

export type TeamHpSegment = { key: number; width: number; fill: number; alive: boolean };

export type TeamHpSideView = {
  hp: string;
  fill: number;
  segments: TeamHpSegment[];
  vehicles: (TeamHpVehicle & { key: number; bar: number; alpha: number })[];
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
