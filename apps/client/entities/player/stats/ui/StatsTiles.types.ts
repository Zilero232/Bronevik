import type { StatsBlock } from '@bronevik/schemas';

export type StatsTilesProps = {
  stats: StatsBlock;
  reference?: StatsBlock | null;
  trends?: Partial<Record<'avgDamage' | 'winRate' | 'wn8', number[]>>;
  className?: string;
};
