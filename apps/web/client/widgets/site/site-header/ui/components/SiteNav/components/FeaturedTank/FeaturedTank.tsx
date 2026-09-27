'use client';

import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { percentText } from '@/shared/lib';
import { Skeleton, TankImage, TierNumeral } from '@/ui-kit';

import { NAV_MENU } from '../../../../../config';
import { useTopTank } from '../../../../../model/hooks';

import s from './FeaturedTank.module.scss';

export const FeaturedTank = () => {
  const t = useTranslations('nav.featured');
  const format = useFormatter();
  const { row, isPending } = useTopTank();

  if (isPending) {
    return <Skeleton height={NAV_MENU.featuredSkeletonHeight} shape='block' />;
  }

  if (!row) {
    return null;
  }

  return (
    <NavigationMenu.Link closeOnClick className={s.root} render={<Link href={ROUTES.tanks.detail(row.vehicle.slug)} />}>
      <span className={s.eyebrow}>{t('topTank')}</span>
      <TankImage isDecorative className={s.render} size='big' tank={row.vehicle} />
      <span className={s.name}>
        <TierNumeral tier={row.vehicle.tier} />
        {row.vehicle.name}
      </span>
      <span className={s.meta}>{t('winRate', { value: percentText({ format, value: row.winRate, digits: 1 }) })}</span>
    </NavigationMenu.Link>
  );
};
