'use client';

import { Trophy } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { RequirementsList } from '@/features/community/stat-requirements';
import { Card, FactGrid } from '@/ui-kit';

import type { TournamentSummaryProps } from './TournamentSummary.types';

import { useTournamentSummary } from '../../../model/hooks';

import s from './TournamentSummary.module.scss';

export const TournamentSummary = ({ tournament }: TournamentSummaryProps) => {
  const t = useTranslations('tournaments.summary');
  const format = useFormatter();
  const { startsAt, registrationEndsAt, champion } = useTournamentSummary(tournament);

  return (
    <Card className={s.root} padding='sm'>
      <FactGrid
        items={[
          { id: 'startsAt', label: t('startsAt'), value: startsAt },
          { id: 'registrationEndsAt', label: t('registrationEndsAt'), value: registrationEndsAt ?? t('untilStart') },
          {
            id: 'participants',
            label: t('participants'),
            value: `${format.number(tournament.participants.length)} / ${format.number(tournament.maxParticipants)}`
          },
          ...(champion
            ? [
                {
                  id: 'champion',
                  label: t('champion'),
                  value: (
                    <span className={s.champion}>
                      <Trophy size={14} />
                      {champion}
                    </span>
                  )
                }
              ]
            : [])
        ]}
      />
      <div className={s.requirements}>
        <span className={s.label}>{t('requirements')}</span>
        <RequirementsList requirements={tournament.requirements} />
      </div>
    </Card>
  );
};
