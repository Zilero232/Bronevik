'use client';

import { useTranslations } from 'next-intl';

import { usePlus } from '@/entities/plus/subscription';

import s from './PlusHeader.module.scss';

export const PlusHeader = () => {
  const t = useTranslations('plus.header');
  const tBrand = useTranslations('brand');
  const { trialAvailable, trialDays, isSignedIn } = usePlus();

  return (
    <header className={s.root}>
      <h1 className={s.title}>{tBrand('plus')}</h1>
      <p className={s.description}>{t('description')}</p>
      {(trialAvailable || !isSignedIn) && <p className={s.offer}>{t('trialOffer', { days: trialDays })}</p>}
    </header>
  );
};
