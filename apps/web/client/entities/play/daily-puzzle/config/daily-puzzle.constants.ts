import { GlobalMapIcon, HeavyTankSilhouetteIcon } from '@otmetki/icons';

import { ROUTES } from '@/shared/constants';

import type { GuessStreak } from '../lib/streak/streak.types';

export const EMPTY_STREAK = { current: 0, best: 0, played: 0, wins: 0, lastDay: null } as const satisfies GuessStreak;

export const DAILY_PUZZLES = {
  guessTank: {
    href: ROUTES.play.guessTank,
    icon: HeavyTankSilhouetteIcon,
    epoch: '2026-01-01',
    storageKey: 'otmetki-guess-tank',
    streakKey: 'otmetki-guess-tank:streak'
  },
  guessMap: {
    href: ROUTES.play.guessMap,
    icon: GlobalMapIcon,
    epoch: '2026-09-29',
    storageKey: 'otmetki-guess-map',
    streakKey: 'otmetki-guess-map:streak'
  }
} as const;

export type DailyPuzzleKey = keyof typeof DAILY_PUZZLES;

export const DAILY_PUZZLE_KEYS = ['guessTank', 'guessMap'] as const satisfies readonly DailyPuzzleKey[];
