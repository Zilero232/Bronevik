import type { CommunityPlayerStats } from '../lib/stats-tones';

export type PlayerStatsLineProps = {
  stats: CommunityPlayerStats | null;
  className?: string;
};
