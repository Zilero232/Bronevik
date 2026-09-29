import type { DailyPuzzleKey } from '../../config';

import { DAILY_PUZZLE_KEYS } from '../../config';

export const otherPuzzles = (current: DailyPuzzleKey): DailyPuzzleKey[] => DAILY_PUZZLE_KEYS.filter((key) => key !== current);
