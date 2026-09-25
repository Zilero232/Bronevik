'use client';

import type { TankDetail, VehicleSummary } from '@bronevik/schemas';

import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { GuessSubject } from '../../lib/compare-guess';
import type { GuessGameState } from './guess-game.types';

import { GUESS_CLUES, GUESS_TANK } from '../../config';
import { compareGuess } from '../../lib/compare-guess';
import { pickDailyTank, puzzleNumber } from '../../lib/daily-puzzle';
import { gameStatus, revealedClues } from '../../lib/game-status';
import { activeStreak, recordResult } from '../../lib/streak';
import { useGuessStorage, usePuzzleDay, useTankIntel } from '../hooks';

const subjectOf = (vehicle: VehicleSummary, detail: TankDetail | undefined): GuessSubject => {
  const row = detail?.serverStats.find(({ cohort }) => cohort === 'all');

  return { vehicle, avgDamage: row?.avgDamage ?? null, winRate: row?.winRate ?? null };
};

export const useGuessGameState = (): GuessGameState => {
  const { data: vehicles = [], isLoading, isError } = useVehicleCatalog();
  const { day, refreshDay } = usePuzzleDay();
  const { guessIds, streak, setBoard, setStreak } = useGuessStorage(day);

  const target = day === null ? null : pickDailyTank({ vehicles, day });
  const byId = new Map(vehicles.map((vehicle) => [vehicle.tankId, vehicle]));
  const guessed = guessIds.flatMap((id) => byId.get(id) ?? []);
  const intel = useTankIntel(target ? [target, ...guessed] : guessed);

  if (isError) {
    return { kind: 'error' };
  }

  if (isLoading || day === null) {
    return { kind: 'loading' };
  }

  if (!target) {
    return { kind: 'unavailable' };
  }

  const targetSubject = subjectOf(target, intel.get(target.tankId));
  const guesses = guessed.map((vehicle) => {
    const subject = subjectOf(vehicle, intel.get(vehicle.tankId));

    return { subject, feedback: compareGuess({ guess: subject, target: targetSubject }) };
  });

  const status = gameStatus({ guessIds, targetId: target.tankId, maxGuesses: GUESS_TANK.maxGuesses });
  const misses = guesses.filter(({ feedback }) => !feedback.isCorrect).length;

  const submit = (vehicle: VehicleSummary) => {
    if (status !== 'playing' || guessIds.includes(vehicle.tankId)) {
      return;
    }

    const next = [...guessIds, vehicle.tankId];
    const nextStatus = gameStatus({ guessIds: next, targetId: target.tankId, maxGuesses: GUESS_TANK.maxGuesses });

    setBoard({ day, guessIds: next });

    if (nextStatus !== 'playing') {
      setStreak(recordResult({ streak, day, isWon: nextStatus === 'won' }));
    }
  };

  return {
    kind: 'ready',
    game: {
      day,
      number: puzzleNumber(day),
      target,
      targetDetail: intel.get(target.tankId),
      guesses,
      status,
      clueCount: revealedClues({ misses, total: GUESS_CLUES.length, isOver: status !== 'playing' }),
      streak,
      currentStreak: activeStreak({ streak, today: day }),
      refreshDay,
      submit
    }
  };
};
