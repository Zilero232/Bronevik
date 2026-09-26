'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { PageHero } from '@/ui-kit';

import { useTanksFigures } from '../../../model/hooks';
import { TanksFigures } from '../TanksFigures';

export const TanksHero = () => {
  const t = useTranslations('tanks.head');
  const tNav = useTranslations('tanks.hero');
  const { heroTanks } = useTanksFigures();

  return (
    <PageHero
      art={heroTanks.length > 0 ? { kind: 'tanks', tanks: heroTanks } : undefined}
      breadcrumbs={[{ label: tNav('home'), href: ROUTES.home }, { label: t('title') }]}
      figures={<TanksFigures />}
      lead={t('description')}
      title={t('title')}
    />
  );
};
