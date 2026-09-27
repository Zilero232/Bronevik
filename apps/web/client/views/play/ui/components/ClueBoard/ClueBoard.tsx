'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader } from '@/ui-kit';

import { GUESS_CLUES } from '../../../config';
import { useGuessGame } from '../../../model/context';
import { ClueCard } from '../ClueCard';

import s from './ClueBoard.module.scss';

export const ClueBoard = () => {
  const t = useTranslations('play.clues');
  const { clueCount } = useGuessGame();

  return (
    <Card padding='none' variant='panel'>
      <CardHeader meta={t('count', { count: clueCount, total: GUESS_CLUES.length })} title={t('title')} />
      <ol className={s.list}>
        {GUESS_CLUES.map((clue, index) => (
          <ClueCard key={clue} clue={clue} index={index} isRevealed={index < clueCount} />
        ))}
      </ol>
    </Card>
  );
};
