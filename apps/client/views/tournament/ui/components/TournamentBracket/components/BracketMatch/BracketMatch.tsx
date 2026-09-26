'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import type { BracketMatchProps } from './BracketMatch.types';

import s from './BracketMatch.module.scss';

export const BracketMatch = ({ match, canReport, isReporting, onReport }: BracketMatchProps) => {
  const t = useTranslations('tournaments.bracket');

  return (
    <div className={s.root} data-decided={match.isDecided || undefined}>
      {(
        [
          ['a', match.a],
          ['b', match.b]
        ] as const
      ).map(([side, slot]) => (
        <div key={side} className={s.side} data-winner={slot?.isWinner || undefined}>
          <span className={s.seed}>{slot?.seed ?? ''}</span>
          <span className={s.name}>{slot ? slot.label : match.isBye ? t('bye') : t('tbd')}</span>
          {canReport && slot && (
            <Button
              disabled={isReporting}
              size='sm'
              title={t('reportWinner', { name: slot.label })}
              variant='ghost'
              onClick={() => onReport({ round: match.round, index: match.index, winner: slot.accountId })}
            >
              {t('won')}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
