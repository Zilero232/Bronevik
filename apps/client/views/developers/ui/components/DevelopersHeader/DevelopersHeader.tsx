'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import s from './DevelopersHeader.module.scss';

export const DevelopersHeader = () => {
  const t = useTranslations('developers.header');

  return (
    <header className={s.root}>
      <div className={s.copy}>
        <h1 className={s.title}>{t('title')}</h1>
        <p className={s.lead}>{t('lead')}</p>
      </div>
      <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={ROUTES.account.developer}>
        {t('getKey')}
      </Link>
    </header>
  );
};
