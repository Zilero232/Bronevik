'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { LiveLamp } from '@/ui-kit';

import { useLiveStreamers } from '../../../../../model/hooks';
import { FeaturedLink } from '../FeaturedLink';

export const FeaturedStreamers = () => {
  const t = useTranslations('nav.featured');
  const { count } = useLiveStreamers();

  if (count === 0) {
    return null;
  }

  return (
    <FeaturedLink
      eyebrow={<LiveLamp label={t('liveNow')} size='sm' />}
      href={{ pathname: ROUTES.streamers.list, query: { live: 'true' } }}
      meta={t('liveStreamersHint')}
      title={t('liveStreamers', { count })}
    />
  );
};
