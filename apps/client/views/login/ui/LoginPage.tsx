'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { PageHeader } from '@/ui-kit';

import { LOGIN } from '../config';
import { LoginOptions } from './components';

import s from './LoginPage.module.scss';

export const LoginPage = () => {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();

  return (
    <div className={s.root}>
      <PageHeader description={t('lead')} title={t('title')} />
      <LoginOptions error={searchParams.get(LOGIN.errorParam)} />
    </div>
  );
};
