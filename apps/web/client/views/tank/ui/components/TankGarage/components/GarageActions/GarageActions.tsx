'use client';

import { useTranslations } from 'next-intl';

import { CompareToggle } from '@/features/compare/compare-selection';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import { useTank } from '../../../../../model/context';

import s from './GarageActions.module.scss';

export const GarageActions = () => {
  const t = useTranslations('tank.garage');
  const tArmor = useTranslations('armor');
  const { detail, slug } = useTank();

  return (
    <nav aria-label={t('actionsLabel')} className={s.root}>
      <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={ROUTES.tanks.armor(slug)}>
        {tArmor('link')}
      </Link>
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.builds.detail(slug)}>
        {t('build')}
      </Link>
      <CompareToggle entry={{ kind: 'tank', item: detail.vehicle }} variant='button' />
    </nav>
  );
};
