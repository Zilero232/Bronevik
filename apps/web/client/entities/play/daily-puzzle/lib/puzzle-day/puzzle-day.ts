import { differenceInSeconds } from 'date-fns';

import { dayKey, daysBetween, nextDayStart, shiftDay } from '@/shared/lib';

import type { PuzzleNumberInput } from './puzzle-day.types';

export const puzzleDay = (now: Date) => dayKey({ date: now });

export const previousDay = (day: string) => shiftDay({ day, amount: -1 });

export const puzzleNumber = ({ epoch, day }: PuzzleNumberInput) => daysBetween({ from: epoch, to: day }) + 1;

export const nextPuzzleAt = (now: Date) => nextDayStart({ date: now });

export const secondsUntilNextPuzzle = (now: Date) => differenceInSeconds(nextPuzzleAt(now), now, { roundingMethod: 'ceil' });

export const daySeed = (day: string) => Number(day.replaceAll('-', ''));
