import type { LeaderboardEntry } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type PodiumCardProps = {
  entry: LeaderboardEntry;
  metricLabel: ReactNode;
};
