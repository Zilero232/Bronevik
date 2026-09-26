'use client';

import { Lock } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { CompetitionStatusBadge } from '@/entities/competition/competition';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { CompetitionRowProps } from './CompetitionRow.types';

import { COMPETITION_LIST } from '../../../../../config';

import s from './CompetitionRow.module.scss';

export const CompetitionRow = ({ competition }: CompetitionRowProps) => {
  const t = useTranslations('competitions');
  const format = useFormatter();

  return (
    <div className={s.root}>
      <div className={s.main}>
        <Link className={s.title} href={ROUTES.competitions.detail(competition.slug)}>
          {competition.visibility === 'private' && <Lock aria-label={t('visibility.private')} size={12} />}
          {competition.title}
        </Link>
        <span className={s.meta}>
          {t('list.rules', {
            mode: t(`modes.${competition.mode}`),
            battles: competition.battlesPerPlayer,
            tier: competition.minTier ?? 0
          })}
          {competition.leader && ` · ${t('list.leader', { team: competition.leader })}`}
        </span>
      </div>
      <CompetitionStatusBadge status={competition.status} />
      <span className={s.date}>
        {format.dateTimeRange(new Date(competition.startsAt), new Date(competition.endsAt), COMPETITION_LIST.dateFormat)}
      </span>
      <span className={s.count}>{t('list.participants', { teams: competition.teams, players: competition.participants })}</span>
    </div>
  );
};
