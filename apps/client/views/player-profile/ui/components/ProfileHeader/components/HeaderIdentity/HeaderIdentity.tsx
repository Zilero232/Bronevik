'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ClanEmblem } from '@/entities/clan/clan';
import { CosmeticBadge } from '@/entities/player/cosmetics';
import { clanLabel } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { RelativeTime } from '@/ui-kit';

import type { HeaderIdentityProps } from './HeaderIdentity.types';

import s from './HeaderIdentity.module.scss';

export const HeaderIdentity = ({ summary, badge }: HeaderIdentityProps) => {
  const t = useTranslations('profile.header');
  const format = useFormatter();

  const { clan, createdAt, lastBattleAt } = summary;

  return (
    <div className={s.root}>
      <div className={s.title}>
        {clan ? (
          <Link className={s.clan} href={ROUTES.clans.detail(clan.tag)}>
            <ClanEmblem size='xs' src={clan.emblem} tag={clan.tag} />
            <span className={s.tag}>{clanLabel({ tag: clan.tag })}</span>
            <span className={s.clanName}>{clan.name}</span>
          </Link>
        ) : (
          <span className={s.muted}>{t('noClan')}</span>
        )}
        {badge && <CosmeticBadge code={badge} />}
      </div>
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
