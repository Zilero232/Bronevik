'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import type { ObtainMissionsProps } from './ObtainMissions.types';

import s from './ObtainMissions.module.scss';

export const ObtainMissions = ({ items }: ObtainMissionsProps) => {
  const t = useTranslations('tank.obtain.missions');

  return (
    <div className={s.root}>
      <h3 className={s.title}>{t('title')}</h3>
      <ul className={s.list}>
        {items.map(({ key, href, campaign, operation, isCampaignReward }) => (
          <li key={key} className={s.row}>
            <Link className={s.link} href={href}>
              {isCampaignReward ? t('campaign', { name: campaign ?? t('unnamed') }) : t('operation', { name: operation ?? t('unnamed') })}
            </Link>
            <span className={s.value}>{isCampaignReward ? t('campaignReward') : (campaign ?? '')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
