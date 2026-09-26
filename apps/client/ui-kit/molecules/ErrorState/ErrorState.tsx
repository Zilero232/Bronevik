'use client';

import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ErrorStateProps } from './ErrorState.types';

import { EmptyState } from '../EmptyState';
import { RetryButton } from '../RetryButton';

export const ErrorState = ({ onRetry, title, description, isRetrying = false, isCompact = false, className }: ErrorStateProps) => {
  const t = useTranslations('common');

  return (
    <EmptyState
      action={<RetryButton disabled={isRetrying} size='sm' onClick={onRetry} />}
      className={className}
      description={description ?? t('loadErrorDescription')}
      icon={<TriangleAlert size={16} />}
      isCompact={isCompact}
      title={title ?? t('loadErrorTitle')}
    />
  );
};
