'use client';

import { Box } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EmptyState, ErrorState } from '@/ui-kit';

import type { CompareFallbackProps } from './CompareFallback.types';

import { ArmorLimit } from '../ArmorLimit';
import { ArmorLoading } from '../ArmorLoading';

export const CompareFallback = ({ status, quota, onRetry }: CompareFallbackProps) => {
  const t = useTranslations('armor.states');

  if (status === 'limited') {
    return <ArmorLimit {...quota} />;
  }

  if (status === 'missing') {
    return <EmptyState description={t('emptyDescription')} icon={<Box size={36} strokeWidth={1.5} />} title={t('emptyTitle')} />;
  }

  if (status === 'error') {
    return <ErrorState description={t('errorDescription')} title={t('errorTitle')} onRetry={onRetry} />;
  }

  return <ArmorLoading />;
};
