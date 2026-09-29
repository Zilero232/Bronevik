'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import type { ObtainMissionsProps } from './ObtainMissions.types';

import { ObtainList } from '../ObtainList';

import s from './ObtainMissions.module.scss';

export const ObtainMissions = ({ items }: ObtainMissionsProps) => {
  const t = useTranslations('tank.obtain.missions');

  return (
    <ObtainList
      rows={items.map(({ key, href, campaign, operation, isCampaignReward }) => ({
        key,
        label: (
          <Link className={s.link} href={href}>
            {isCampaignReward ? t('campaign', { name: campaign ?? t('unnamed') }) : t('operation', { name: operation ?? t('unnamed') })}
          </Link>
        ),
        value: isCampaignReward ? t('campaignReward') : (campaign ?? '')
      }))}
      title={t('title')}
    />
  );
};
