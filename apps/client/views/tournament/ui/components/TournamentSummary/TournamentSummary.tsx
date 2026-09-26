'use client';

import { Trophy } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { RequirementsList } from '@/features/community/stat-requirements';
import { Card } from '@/ui-kit';

import type { TournamentSummaryProps } from './TournamentSummary.types';

import { useTournamentSummary } from '../../../model/hooks';

import s from './TournamentSummary.module.scss';

export const TournamentSummary = ({ tournament }: TournamentSummaryProps) => {
  const t = useTranslations('tournaments.summary');
  const format = useFormatter();
  const { startsAt, registrationEndsAt, champion } = useTournamentSummary(tournament);

  return (
    <Card className={s.root} padding='sm'>
      <dl className={s.facts}>
        <div className={s.fact}>
          <dt className={s.label}>{t('startsAt')}</dt>
          <dd className={s.value}>{startsAt}</dd>
        </div>
        <div className={s.fact}>
          <dt className={s.label}>{t('registrationEndsAt')}</dt>
          <dd className={s.value}>{registrationEndsAt ?? t('untilStart')}</dd>
        </div>
        <div className={s.fact}>
          <dt className={s.label}>{t('participants')}</dt>
          <dd className={s.value}>
            {format.number(tournament.participants.length)} / {format.number(tournament.maxParticipants)}
          </dd>
        </div>
        {champion && (
          <div className={s.fact}>
            <dt className={s.label}>{t('champion')}</dt>
            <dd className={s.champion}>
              <Trophy size={14} />
              {champion}
            </dd>
          </div>
        )}
      </dl>
      <div className={s.requirements}>
        <span className={s.label}>{t('requirements')}</span>
        <RequirementsList requirements={tournament.requirements} />
      </div>
    </Card>
  );
};
