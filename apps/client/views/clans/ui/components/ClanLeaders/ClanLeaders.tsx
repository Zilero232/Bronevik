'use client';

import { useTranslations } from 'next-intl';

import { Band } from '@/ui-kit';

import type { ClanLeadersProps } from './ClanLeaders.types';

import { ClanLeaderCard } from './components';

import s from './ClanLeaders.module.scss';

export const ClanLeaders = ({ leaders }: ClanLeadersProps) => {
  const t = useTranslations('clans.leaders');

  return (
    <Band aria-labelledby='clan-leaders-title' innerClassName={s.inner}>
      <h2 className={s.title} id='clan-leaders-title'>
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
