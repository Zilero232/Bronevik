import type { ClosestMark } from '../../../lib/closest-marks';

export type PlayerLookupProps = {
  player: string;
  onPick: (player: string) => void;
};

export type ClosestListProps = {
  player: string;
};

export type ClosestRowProps = {
  mark: ClosestMark;
  index: number;
};
