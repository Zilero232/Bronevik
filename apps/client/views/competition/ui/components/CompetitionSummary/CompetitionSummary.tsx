'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Card } from '@/ui-kit';

import type { CompetitionSummaryProps } from './CompetitionSummary.types';

import { COMPETITION_PAGE } from '../../../config';

import s from './CompetitionSummary.module.scss';

export const CompetitionSummary = ({ competition }: CompetitionSummaryProps) => {
  const t = useTranslations('competitions');
  const format = useFormatter();

  return (
    <Card className={s.root} padding='sm'>
      <dl className={s.facts}>
        <div className={s.fact}>
          <dt className={s.label}>{t('summary.period')}</dt>
          <dd className={s.value}>
            {format.dateTimeRange(new Date(competition.startsAt), new Date(competition.endsAt), COMPETITION_PAGE.dateFormat)}
          </dd>
        </div>
        <div className={s.fact}>
          <dt className={s.label}>{t('summary.mode')}</dt>
          <dd className={s.value}>{t(`modes.${competition.mode}`)}</dd>
        </div>
        <div className={s.fact}>
          <dt className={s.label}>{t('summary.battles')}</dt>
          <dd className={s.value}>{format.number(competition.battlesPerPlayer)}</dd>
        </div>
        <div className={s.fact}>
          <dt className={s.label}>{t('summary.minTier')}</dt>
          <dd className={s.value}>{competition.minTier === null ? t('create.anyTier') : t('create.tier', { tier: competition.minTier })}</dd>
        </div>
        <div className={s.fact}>
          <dt className={s.label}>{t('summary.teams')}</dt>
          <dd className={s.value}>
            {t('summary.teamsValue', { teams: competition.teams, players: competition.participants, size: competition.maxTeamSize })}
          </dd>
        </div>
        {competition.organizer && (
          <div className={s.fact}>
            <dt className={s.label}>{t('summary.organizer')}</dt>
            <dd className={s.value}>{competition.organizer}</dd>
          </div>
        )}
      </dl>
    </Card>
  );
};
