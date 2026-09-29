import type { ReactNode } from 'react';

import type { GuessStreak } from '../../lib/streak';

export type DailyResultProps = {
  status: 'lost' | 'won';
  title: ReactNode;
  text: ReactNode;
  shareLabel: ReactNode;
  detail: { href: string; label: ReactNode };
  streak: GuessStreak;
  currentStreak: number;
  onShare: () => void;
  onExpire: () => void;
};
