'use client';

import { OtmetkiLogoIcon } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Band, KeyFigure, PageHero } from '@/ui-kit';

import { PLUS_CHECKOUT } from '../config';
import { usePlusPage } from '../model/hooks';
import { PlusBenefits, PlusCheckout, PlusFaq } from './components';

import s from './PlusPage.module.scss';

export const PlusPage = () => {
  const t = useTranslations('plus.header');
  const tBrand = useTranslations('brand');
  const format = useFormatter();
  const { isTrialOffered, trialDays, fromMonthlyRub } = usePlusPage();

  return (
    <div className={s.root}>
      <PageHero
        figures={
          fromMonthlyRub !== null && (
            <KeyFigure
              label={t('priceFigure')}
              size='xl'
              value={t('priceValue', { price: format.number(fromMonthlyRub, PLUS_CHECKOUT.priceFormat) })}
              variant='compact'
            />
          )
        }
        actions={isTrialOffered && <p className={s.offer}>{t('trialOffer', { days: trialDays })}</p>}
        art={{ kind: 'emblem', glyph: <OtmetkiLogoIcon size={480} /> }}
        breadcrumbs={[{ label: t('home'), href: ROUTES.home }, { label: tBrand('plus') }]}
        lead={t('description')}
        title={tBrand('plus')}
      />
      <div className={s.section}>
        <PlusBenefits />
      </div>
      <Band tone='raised'>
        <PlusCheckout />
      </Band>
      <div className={s.section}>
        <PlusFaq />
      </div>
    </div>
  );
};
