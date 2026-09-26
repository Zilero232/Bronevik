'use client';

import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { CalendarDays } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Skeleton } from '@/ui-kit';

import { NAV_MENU } from '../../../../../config';
import { useCurrentEvent } from '../../../../../model/hooks';

import s from './FeaturedEvent.module.scss';

export const FeaturedEvent = () => {
  const t = useTranslations('nav.featured');
  const format = useFormatter();
  const { event, isPending } = useCurrentEvent();

  if (isPending) {
    return <Skeleton height={NAV_MENU.featuredSkeletonHeight} shape='block' />;
  }

  if (!event) {
    return null;
  }

  return (
    <NavigationMenu.Link closeOnClick className={s.root} render={<Link href={ROUTES.events} />}>
      <span className={s.eyebrow}>
        <CalendarDays aria-hidden size={14} />
        {t('currentEvent')}
      </span>
      <span className={s.title}>{event.title}</span>
      {event.endsAt && <span className={s.meta}>{t('endsAt', { date: format.dateTime(new Date(event.endsAt), NAV_MENU.eventDateFormat) })}</span>}
    </NavigationMenu.Link>
  );
};
