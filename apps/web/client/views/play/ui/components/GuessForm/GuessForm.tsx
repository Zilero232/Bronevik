'use client';

import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button } from '@/ui-kit';

import { GUESS_TANK } from '../../../config';
import { useGuessForm } from '../../../model/hooks';

import s from './GuessForm.module.scss';

export const GuessForm = () => {
  const t = useTranslations('play.form');
  const { pick, setPick, guessedIds, attempt, onSubmit } = useGuessForm();

  return (
    <form className={s.root} onSubmit={onSubmit}>
      <TankPicker
        className={s.picker}
        excludeIds={guessedIds}
        label={t('label', { attempt, total: GUESS_TANK.maxGuesses })}
        placeholder={t('placeholder')}
        value={pick}
        onChange={setPick}
      />
      <Button className={s.submit} disabled={!pick} size='md' type='submit'>
        {t('submit')}
      </Button>
    </form>
  );
};
