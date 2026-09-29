import type { DailyPuzzleKey } from '../../config';

export type DailyPuzzleCardProps = {
  puzzle: DailyPuzzleKey;
  size?: 'lg' | 'sm';
  titleAs?: 'h2' | 'h3';
};
