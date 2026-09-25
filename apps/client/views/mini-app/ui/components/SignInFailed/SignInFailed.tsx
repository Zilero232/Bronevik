'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, EmptyState } from '@/ui-kit';

import type { SignInFailedProps } from './SignInFailed.types';

export const SignInFailed = ({ isRetrying, onRetry }: SignInFailedProps) => {
  const t = useTranslations('tg.failed');

  return (
    <EmptyState
      action={
        <Button disabled={isRetrying} size='lg' onClick={onRetry}>
          <RefreshCw size={18} />
          {t('retry')}
        </Button>
      }
      code='401'
      description={t('description')}
      title={t('title')}
    />
  );
};
