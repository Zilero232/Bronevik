'use client';

import { useTranslations } from 'next-intl';

import { PageHeader } from '@/ui-kit';

import { useLoginError } from '../model/hooks';
import { LoginOptions } from './components';

import s from './LoginPage.module.scss';

export const LoginPage = () => {
  const t = useTranslations('auth');
  const error = useLoginError();

  return (
    <div className={s.root}>
      <PageHeader description={t('lead')} title={t('title')} />
      <LoginOptions error={error} />
    </div>
  );
};
