'use client';

import { useTranslations } from 'next-intl';

import { PROMO_CAROUSEL } from '../../config';
import { usePromoBoard } from '../../model/hooks';
import { PromoCarousel, PromoSocial } from '../components';

import s from './PromoBoard.module.scss';

export const PromoBoard = () => {
  const t = useTranslations('promo.board');
  const { hero, tiles, isManagerReady } = usePromoBoard();

  return (
    <section aria-labelledby='promo-board-title' className={s.root}>
      <h2 className={s.srTitle} id='promo-board-title'>
        {t('title')}
      </h2>
      <div className={s.grid}>
        <PromoCarousel className={s.hero} delay={PROMO_CAROUSEL.heroDelay} items={hero} label={t('hero')} variant='hero' />
        {tiles.map(({ key, items, delay }, index) => (
          <PromoCarousel key={key} className={s.tile} delay={delay} items={items} label={t('tile', { index: index + 1 })} variant='tile' />
        ))}
      </div>
      <PromoSocial isManagerReady={isManagerReady} />
    </section>
  );
};
