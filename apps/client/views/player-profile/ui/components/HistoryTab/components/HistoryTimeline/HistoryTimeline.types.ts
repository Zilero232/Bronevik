import type { PlayerHistoryEntry } from '@bronevik/schemas';
import type { ReactNode } from 'react';

export type HistoryTimelineProps = {
  entries: PlayerHistoryEntry[];
  icon: ReactNode;
};
