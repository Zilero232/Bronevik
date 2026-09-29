'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Card, FactGrid } from '@/ui-kit';

import type { CompetitionSummaryProps } from './CompetitionSummary.types';

import { COMPETITION_PAGE } from '../../../config';

import s from './CompetitionSummary.module.scss';

export const CompetitionSummary = ({ competition }: CompetitionSummaryProps) => {
  const t = useTranslations('competitions');
  const format = useFormatter();

  return (
    <Card className={s.root} padding='sm'>
      <FactGrid
        items={[
          {
            id: 'period',
            label: t('summary.period'),
            value: format.dateTimeRange(new Date(competition.startsAt), new Date(competition.endsAt), COMPETITION_PAGE.dateFormat)
          },
          { id: 'mode', label: t('summary.mode'), value: t(`modes.${competition.mode}`) },
          { id: 'battles', label: t('summary.battles'), value: format.number(competition.battlesPerPlayer) },
          {
            id: 'minTier',
            label: t('summary.minTier'),
            value: competition.minTier === null ? t('create.anyTier') : t('create.tier', { tier: competition.minTier })
          },
          {
            id: 'teams',
            label: t('summary.teams'),
            value: t('summary.teamsValue', { teams: competition.teams, players: competition.participants, size: competition.maxTeamSize })
          },
          ...(competition.organizer ? [{ id: 'organizer', label: t('summary.organizer'), value: competition.organizer }] : [])
        ]}
      />
    </Card>
  );
};
