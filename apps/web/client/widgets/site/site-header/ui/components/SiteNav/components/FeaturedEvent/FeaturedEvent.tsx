'use client';

import { CalendarDays } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Skeleton } from '@/ui-kit';

import { NAV_MENU } from '../../../../../config';
import { useCurrentEvent } from '../../../../../model/hooks';
import { FeaturedLink } from '../FeaturedLink';

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
    <FeaturedLink
      isAccent
      eyebrow={
        <>
          <CalendarDays aria-hidden size={14} />
          {t('currentEvent')}
        </>
      }
      href={ROUTES.events}
      meta={event.endsAt && t('endsAt', { date: format.dateTime(new Date(event.endsAt), NAV_MENU.eventDateFormat) })}
      title={event.title}
    />
  );
};
