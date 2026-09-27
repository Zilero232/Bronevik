'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, EmptyState } from '@/ui-kit';

import type { ErrorViewProps } from './ErrorView.types';

import s from './ErrorView.module.scss';

export const ErrorView = ({ reset }: ErrorViewProps) => {
  const t = useTranslations('error');

  return (
    <section className={s.root}>
      <EmptyState
        action={
          <div className={s.actions}>
            <Button onClick={reset}>{t('retry')}</Button>
            <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.home}>
              {t('home')}
            </Link>
          </div>
        }
        description={t('body')}
        title={t('title')}
      />
    </section>
  );
};
