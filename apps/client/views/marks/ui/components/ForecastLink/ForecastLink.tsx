'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader } from '@/ui-kit';

import { FORECAST_LINK } from '../../../config';

import s from './ForecastLink.module.scss';

export const ForecastLink = () => {
  const t = useTranslations('marks.forecast');

  return (
    <Card aria-label={t('title')} padding='none' role='region'>
      <CardHeader className={s.header} title={t('title')} />
      <div className={s.body}>
        <p className={s.text}>{t('description')}</p>
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={{ pathname: ROUTES.tools, query: FORECAST_LINK }}>
          {t('action')}
        </Link>
      </div>
    </Card>
  );
};
