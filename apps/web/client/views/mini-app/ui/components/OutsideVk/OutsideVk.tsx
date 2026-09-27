'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import s from './OutsideVk.module.scss';

export const OutsideVk = () => {
  const t = useTranslations('tg.vkOutside');

  return (
    <section className={s.root}>
      <h1 className={s.title}>{t('title')}</h1>
      <p className={s.description}>{t('description')}</p>
      <Link className={buttonVariants({ block: true })} href={ROUTES.home}>
        {t('site')}
      </Link>
    </section>
  );
};
