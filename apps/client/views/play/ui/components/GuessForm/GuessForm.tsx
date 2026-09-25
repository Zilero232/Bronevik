'use client';

import type { VehicleSummary } from '@bronevik/schemas';
import type { FormEvent } from 'react';

import { Crosshair } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button } from '@/ui-kit';

import { GUESS_TANK } from '../../../config';
import { useGuessGame } from '../../../model/context';

import s from './GuessForm.module.scss';

export const GuessForm = () => {
  const t = useTranslations('play.form');
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

  return (
    <form className={s.root} onSubmit={onSubmit}>
      <TankPicker
        className={s.picker}
        excludeIds={guessedIds}
        label={t('label', { attempt: guesses.length + 1, total: GUESS_TANK.maxGuesses })}
        placeholder={t('placeholder')}
        value={pick}
        onChange={setPick}
      />
      <Button className={s.fire} disabled={!pick} size='lg' type='submit'>
        <Crosshair size={18} />
        {t('submit')}
      </Button>
    </form>
  );
};
