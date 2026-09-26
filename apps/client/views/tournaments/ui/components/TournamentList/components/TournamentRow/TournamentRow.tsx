'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { RequirementsList } from '@/features/community/stat-requirements';
import { TournamentStatusBadge } from '@/features/community/tournament-status';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { TournamentRowProps } from './TournamentRow.types';

import { TOURNAMENT_LIST } from '../../../../../config';

import s from './TournamentRow.module.scss';

export const TournamentRow = ({ tournament }: TournamentRowProps) => {
  const t = useTranslations('tournaments.list');
  const format = useFormatter();

  return (
    <div className={s.root}>
      <div className={s.main}>
        <Link className={s.title} href={ROUTES.tournaments.detail(tournament.slug)}>
          {tournament.title}
        </Link>
        <RequirementsList requirements={tournament.requirements} />
      </div>
      <TournamentStatusBadge status={tournament.status} />
      <span className={s.date}>{format.dateTime(new Date(tournament.startsAt), TOURNAMENT_LIST.dateFormat)}</span>
      <span className={s.count}>{t('participants', { count: tournament.participants.length, max: tournament.maxParticipants })}</span>
    </div>
  );
};
