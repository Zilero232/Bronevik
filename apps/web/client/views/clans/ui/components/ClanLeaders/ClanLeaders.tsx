'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Band, Skeleton } from '@/ui-kit';

import type { ClanLeadersProps } from './ClanLeaders.types';

import { CLAN_RATING } from '../../../config';
import { ClanLeaderCard } from './components';

import s from './ClanLeaders.module.scss';

export const ClanLeaders = ({ leaders, isLoading = false }: ClanLeadersProps) => {
  const t = useTranslations('clans.leaders');
  const titleId = useId();

  return (
    <Band aria-labelledby={titleId} innerClassName={s.inner}>
      <h2 className={s.title} id={titleId}>
        {t('title')}
      </h2>
      {isLoading ? (
        <div aria-busy className={s.list}>
          <Skeleton className={s.placeholder} count={CLAN_RATING.leaders} shape='block' />
        </div>
      ) : (
        <ol className={s.list}>
          {leaders.map((item, index) => (
            <ClanLeaderCard key={item.clan.clanId} item={item} rank={index + 1} />
          ))}
        </ol>
      )}
    </Band>
  );
};
