'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { COMPETITION_SOURCE_TONE } from '@/entities/competition/competition';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge } from '@/ui-kit';

import type { MembersCellProps } from './MembersCell.types';

import { COMPETITION_PAGE } from '../../../../../config';

import s from './MembersCell.module.scss';

export const MembersCell = ({ members, battlesPerPlayer }: MembersCellProps) => {
  const t = useTranslations('competitions.standings');
  const format = useFormatter();

  return (
    <ul className={s.root}>
      {members.map((member) => (
        <li key={member.accountId} className={s.member}>
          <Link className={s.link} href={ROUTES.players.profile(member.nickname ?? String(member.accountId))}>
            {member.nickname ?? `#${member.accountId}`}
          </Link>
          <Badge title={t(`sourceHint.${member.source}`)} tone={COMPETITION_SOURCE_TONE[member.source]}>
            {t(`source.${member.source}`)}
          </Badge>
          <span className={s.stats}>
            {t('memberStats', {
              battles: member.battles,
              total: battlesPerPlayer,
              score: format.number(member.score, COMPETITION_PAGE.scoreFormat)
            })}
          </span>
        </li>
      ))}
    </ul>
  );
};
