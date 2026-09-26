'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ClanEmblem } from '@/entities/clan/clan';
import { clanLabel } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { RelativeTime } from '@/ui-kit';

import type { HeaderIdentityProps } from './HeaderIdentity.types';

import s from './HeaderIdentity.module.scss';

export const HeaderIdentity = ({ summary }: HeaderIdentityProps) => {
  const t = useTranslations('profile.header');
  const format = useFormatter();

  const { nickname, clan, createdAt, lastBattleAt } = summary;

  return (
    <div className={s.root}>
      <h1 className={s.nickname}>{nickname}</h1>
      {clan ? (
        <Link className={s.clan} href={ROUTES.clan(clan.tag)}>
          <ClanEmblem size='sm' src={clan.emblem} tag={clan.tag} />
          <span className={s.tag}>{clanLabel({ tag: clan.tag })}</span>
          <span className={s.clanName}>{clan.name}</span>
        </Link>
      ) : (
        <span className={s.muted}>{t('noClan')}</span>
      )}
      <p className={s.meta}>
        {createdAt && <span>{t('since', { year: format.dateTime(new Date(createdAt), { year: 'numeric' }) })}</span>}
        {lastBattleAt && (
          <span>
            {t('lastBattle')} <RelativeTime value={lastBattleAt} />
          </span>
        )}
      </p>
    </div>
  );
};
