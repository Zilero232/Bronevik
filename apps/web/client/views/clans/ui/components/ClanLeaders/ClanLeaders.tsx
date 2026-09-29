'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Band } from '@/ui-kit';

import type { ClanLeadersProps } from './ClanLeaders.types';

import { ClanLeaderCard } from './components';

import s from './ClanLeaders.module.scss';

export const ClanLeaders = ({ leaders }: ClanLeadersProps) => {
  const t = useTranslations('clans.leaders');
  const titleId = useId();

  return (
    <Band aria-labelledby={titleId} innerClassName={s.inner}>
      <h2 className={s.title} id={titleId}>
        {t('title')}
      </h2>
      <ol className={s.list}>
        {leaders.map((item, index) => (
          <ClanLeaderCard key={item.clan.clanId} item={item} rank={index + 1} />
        ))}
      </ol>
    </Band>
  );
};
