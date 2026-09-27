'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import { useTank } from '../../../../../model/context';

import s from './GarageActions.module.scss';

export const GarageActions = () => {
  const t = useTranslations('tank.garage');
  const tArmor = useTranslations('armor');
  const { tankId, slug } = useTank();

  return (
    <nav aria-label={t('actionsLabel')} className={s.root}>
      <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={ROUTES.tanks.armor(slug)}>
        {tArmor('link')}
      </Link>
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.builds.detail(slug)}>
        {t('build')}
      </Link>
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={`${ROUTES.tanks.compare}?ids=${tankId}`}>
        {t('compare')}
      </Link>
    </nav>
  );
};
