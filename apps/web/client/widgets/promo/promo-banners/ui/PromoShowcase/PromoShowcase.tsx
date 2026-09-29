'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { PROMO_ANCHOR, PROMO_CAROUSEL } from '../../config';
import { usePromoShowcase } from '../../model/hooks';
import { PromoCarousel } from '../components';

import s from './PromoShowcase.module.scss';

export const PromoShowcase = () => {
  const t = useTranslations('promo.showcase');
  const { items } = usePromoShowcase();

  return (
    <section className={s.root} id={PROMO_ANCHOR.showcase}>
      <SectionHeader description={t('lead')} title={t('title')} variant='display' />
      <PromoCarousel delay={PROMO_CAROUSEL.heroDelay} hasCta={false} items={items} label={t('title')} variant='hero' />
    </section>
  );
};
