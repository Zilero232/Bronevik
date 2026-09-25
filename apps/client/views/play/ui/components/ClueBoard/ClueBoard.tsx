'use client';

import { useTranslations } from 'next-intl';

import { GUESS_CLUES } from '../../../config';
import { useGuessGame } from '../../../model/context';
import { ClueCard } from '../ClueCard';

import s from './ClueBoard.module.scss';

export const ClueBoard = () => {
  const t = useTranslations('play.clues');
  const { clueCount } = useGuessGame();

  return (
    <section aria-labelledby='guess-clues' className={s.root}>
      <h2 className={s.title} id='guess-clues'>
        {t('title')}
        <span className={s.count}>
          {clueCount}/{GUESS_CLUES.length}
        </span>
      </h2>
      <ol className={s.list}>
        {GUESS_CLUES.map((clue, index) => (
          <ClueCard key={clue} clue={clue} index={index} isRevealed={index < clueCount} />
        ))}
      </ol>
    </section>
  );
};
