'use client';

import { useTranslations } from 'next-intl';

import { Button, EmptyState } from '@/ui-kit';

import type { ErrorViewProps } from './ErrorView.types';

import s from './ErrorView.module.scss';

export const ErrorView = ({ reset }: ErrorViewProps) => {
  const t = useTranslations('error');

  return (
    <section className={s.root}>
      <EmptyState action={<Button onClick={reset}>{t('retry')}</Button>} description={t('body')} title={t('title')} />
    </section>
  );
};
