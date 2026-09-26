'use client';

import type { VehicleSummary } from '@bronevik/schemas';
import type { FormEvent } from 'react';

import { useState } from 'react';

import { useGuessGame } from '../../context';

export const useGuessForm = () => {
  const { guesses, submit } = useGuessGame();
  const [pick, setPick] = useState<VehicleSummary | null>(null);

  const guessedIds = guesses.map(({ subject }) => subject.vehicle.tankId);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pick) {
      return;
    }

    submit(pick);
    setPick(null);
  };

  return { pick, setPick, guessedIds, attempt: guesses.length + 1, onSubmit };
};
