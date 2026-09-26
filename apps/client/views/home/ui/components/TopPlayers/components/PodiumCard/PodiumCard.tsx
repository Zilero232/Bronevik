import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { toneOfTier } from '@/shared/lib';

import type { PodiumCardProps } from './PodiumCard.types';

import s from './PodiumCard.module.scss';

export const PodiumCard = ({ entry, metricLabel }: PodiumCardProps) => {
  const t = useTranslations('home.topPlayers');
  const format = useFormatter();

  return (
    <Link
      className={s.root}
      data-rank={entry.rank}
      data-tone={entry.tier ? toneOfTier(entry.tier) : undefined}
      href={ROUTES.players.profile(entry.name)}
    >
      <span className={s.rank}>
        <span className={s.srOnly}>{t('rank')}</span>
        {entry.rank}
      </span>
      <span className={s.body}>
        <span className={s.name}>
          {entry.name}
          {entry.clanTag && <span className={s.clan}>[{entry.clanTag}]</span>}
        </span>
        <span className={s.metric}>
          <span className={s.label}>{metricLabel}</span>
          <span className={s.value}>{format.number(entry.value, { maximumFractionDigits: 0 })}</span>
        </span>
        <span className={s.battles}>{t('battles', { count: entry.battles })}</span>
      </span>
    </Link>
  );
};
