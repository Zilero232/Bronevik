'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { activeStreak, puzzleNumber, recordResult, useDailyStorage, usePuzzleDay } from '@/entities/play/daily-puzzle';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { GuessGameState } from '../../context';

import { GUESS_CLUES, GUESS_TANK } from '../../../config';
import { compareGuess } from '../../../lib/compare-guess';
import { pickDailyTank } from '../../../lib/daily-puzzle';
import { gameStatus, revealedClues } from '../../../lib/game-status';
import { guessSubject } from '../../../lib/guess-subject';
import { useTankIntel } from '../use-tank-intel';

export const useGuessGameState = (): GuessGameState => {
  const { data: vehicles = [], isLoading, isError, isFetching, refetch } = useVehicleCatalog();
  const { day, refreshDay } = usePuzzleDay();
  const { guessIds, streak, setBoard, setStreak } = useDailyStorage<number>({
    day,
    storageKey: GUESS_TANK.storageKey,
    streakKey: GUESS_TANK.streakKey
  });

  const target = day === null ? null : pickDailyTank({ vehicles, day });
  const byId = new Map(vehicles.map((vehicle) => [vehicle.tankId, vehicle]));
  const guessed = guessIds.flatMap((id) => byId.get(id) ?? []);
  const intel = useTankIntel(target ? [target, ...guessed] : guessed);

  if (isError) {
    return { kind: 'error', isRetrying: isFetching, retry: () => void refetch() };
  }

  if (isLoading || day === null) {
    return { kind: 'loading' };
  }

  if (!target) {
    return { kind: 'unavailable' };
  }

  const targetSubject = guessSubject({ vehicle: target, detail: intel.get(target.tankId) });
  const guesses = guessed.map((vehicle) => {
    const subject = guessSubject({ vehicle, detail: intel.get(vehicle.tankId) });

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
      number: puzzleNumber({ epoch: GUESS_TANK.epoch, day }),
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
