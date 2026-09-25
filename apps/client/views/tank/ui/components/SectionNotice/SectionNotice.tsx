'use client';

import { CircleSlash, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EmptyState } from '@/ui-kit';

import type { SectionNoticeProps } from './SectionNotice.types';

export const SectionNotice = ({ kind, title, description }: SectionNoticeProps) => {
  const t = useTranslations('tank.notice');

  const isError = kind === 'error';

  return (
    <EmptyState
      code={isError ? t('errorCode') : undefined}
      description={description ?? (isError ? t('errorDescription') : undefined)}
      icon={isError ? <TriangleAlert size={36} strokeWidth={1.5} /> : <CircleSlash size={36} strokeWidth={1.5} />}
      title={title ?? (isError ? t('errorTitle') : t('emptyTitle'))}
    />
  );
};
