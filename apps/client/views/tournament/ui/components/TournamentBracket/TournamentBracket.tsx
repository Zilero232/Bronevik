'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState } from '@/ui-kit';

import type { TournamentBracketProps } from './TournamentBracket.types';

import { useTournamentBracket } from '../../../model/hooks';
import { BracketMatch } from './components';

import s from './TournamentBracket.module.scss';

export const TournamentBracket = ({ tournament }: TournamentBracketProps) => {
  const t = useTranslations('tournaments.bracket');
  const { columns, canReport, isReporting, onReport } = useTournamentBracket(tournament);

  return (
    <Card padding='none'>
      <CardHeader meta={canReport ? t('reportHint') : undefined} title={t('title')} />
      {columns.length === 0 ? (
        <EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />
      ) : (
        <div className={s.scroller}>
          <ol className={s.columns}>
            {columns.map((column) => (
              <li key={column.round} className={s.column}>
                <h3 className={s.round}>{t(`rounds.${column.name}`, { number: column.number })}</h3>
                <ul className={s.matches}>
                  {column.matches.map((match) => (
                    <li key={match.index} className={s.slot}>
                      <BracketMatch canReport={canReport && match.canReport} isReporting={isReporting} match={match} onReport={onReport} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
};
