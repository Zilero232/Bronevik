'use client';

import { useTranslations } from 'next-intl';

import { ErrorState } from '@/ui-kit';

import type { SignInFailedProps } from './SignInFailed.types';

export const SignInFailed = ({ isRetrying, onRetry }: SignInFailedProps) => {
  const t = useTranslations('tg.failed');

  return <ErrorState description={t('description')} isRetrying={isRetrying} title={t('title')} onRetry={onRetry} />;
};
