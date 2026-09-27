'use client';

import { useTranslations } from 'next-intl';

import { PlayerIdentity } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { PlayerCellProps } from './PlayerCell.types';

import s from './PlayerCell.module.scss';

export const PlayerCell = ({ battle: { nickname, source } }: PlayerCellProps) => {
  const t = useTranslations('bestBattles.sources');

  return (
    <span className={s.root}>
      <Link className={s.link} href={ROUTES.players.profile(nickname)}>
        <PlayerIdentity player={{ nickname, clanTag: null }} />
      </Link>
      <span className={s.source}>{t(source)}</span>
    </span>
  );
};
