'use client';

import { CrosshairIcon } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import { PageHero } from '@/ui-kit';

import { CompareDock } from '../CompareDock';

export const CompareHero = () => {
  const t = useTranslations('tanks.compare.hero');

  return (
    <PageHero
      aside={<CompareDock />}
      description={t('description')}
      eyebrow={t('eyebrow')}
      index='// 04'
      title={t('title')}
      watermark={<CrosshairIcon size={220} strokeWidth={0.5} />}
    />
  );
};
