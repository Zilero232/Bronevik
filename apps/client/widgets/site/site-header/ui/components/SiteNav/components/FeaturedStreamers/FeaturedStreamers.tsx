'use client';

import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import { useLiveStreamers } from '../../../../../model/hooks';

import s from './FeaturedStreamers.module.scss';

export const FeaturedStreamers = () => {
  const t = useTranslations('nav.featured');
  const { count } = useLiveStreamers();

  if (count === 0) {
    return null;
  }

  return (
    <NavigationMenu.Link closeOnClick className={s.root} render={<Link href={{ pathname: ROUTES.streamers.list, query: { live: 'true' } }} />}>
      <span className={s.eyebrow}>
        <LiveLamp label={t('liveNow')} size='sm' />
      </span>
      <span className={s.title}>{t('liveStreamers', { count })}</span>
      <span className={s.meta}>{t('liveStreamersHint')}</span>
    </NavigationMenu.Link>
  );
};
