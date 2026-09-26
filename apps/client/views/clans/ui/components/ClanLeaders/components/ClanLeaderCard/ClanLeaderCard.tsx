'use client';

import { Users } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ClanEmblem } from '@/entities/clan/clan';
import { ROUTES } from '@/shared/constants';
import { MediaCard } from '@/ui-kit';

import type { ClanLeaderCardProps } from './ClanLeaderCard.types';

import s from './ClanLeaderCard.module.scss';

export const ClanLeaderCard = ({ item: { clan, avgWn8 }, rank }: ClanLeaderCardProps) => {
  const t = useTranslations('clans.leaders');
  const format = useFormatter();

  return (
    <li className={s.root} data-rank={rank} style={clan.color ? { '--clan': clan.color } : undefined}>
      <MediaCard
        media={
          <span className={s.media}>
            <ClanEmblem className={s.emblem} color={clan.color} size='lg' src={clan.emblem} tag={clan.tag} />
          </span>
        }
        sub={
          avgWn8.value === null
            ? t('members', { count: clan.membersCount })
            : t('plate', { wn8: format.number(avgWn8.value, { maximumFractionDigits: 0 }), count: clan.membersCount })
        }
        aspect='wide'
        href={ROUTES.clans.detail(clan.tag)}
        ribbon={<span className={s.rank}>{t('rank', { rank })}</span>}
        subIcon={<Users size={12} />}
        title={t('name', { tag: clan.tag, name: clan.name })}
      />
    </li>
  );
};
