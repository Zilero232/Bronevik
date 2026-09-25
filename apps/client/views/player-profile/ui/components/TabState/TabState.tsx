'use client';

import { useTranslations } from 'next-intl';

import { EmptyState } from '@/ui-kit';

import type { TabStateProps } from './TabState.types';

export const TabState = ({ kind }: TabStateProps) => {
  const t = useTranslations('profile.state');

  return <EmptyState description={t(`${kind}Description`)} title={t(`${kind}Title`)} />;
};
