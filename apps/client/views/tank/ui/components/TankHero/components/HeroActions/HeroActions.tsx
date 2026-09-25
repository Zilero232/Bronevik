'use client';

import { Crosshair, GitCompareArrows, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import { TANK_SECTIONS } from '../../../../../config';
import { useTank } from '../../../../../model/context';

import s from './HeroActions.module.scss';

export const HeroActions = () => {
  const t = useTranslations('tank.hero');
  const { tankId, slug } = useTank();

  return (
    <nav aria-label={t('actionsLabel')} className={s.root}>
      <Link className={buttonVariants({ variant: 'primary' })} href={ROUTES.build(slug)}>
        <Wrench aria-hidden size={16} />
        {t('build')}
      </Link>
      <Link className={buttonVariants({ variant: 'secondary' })} href={`${ROUTES.compareTanks}?ids=${tankId}`}>
        <GitCompareArrows aria-hidden size={16} />
        {t('compare')}
      </Link>
      <a className={buttonVariants({ variant: 'ghost' })} href={`#${TANK_SECTIONS.marks}`}>
        <Crosshair aria-hidden size={16} />
        {t('marks')}
      </a>
    </nav>
  );
};
