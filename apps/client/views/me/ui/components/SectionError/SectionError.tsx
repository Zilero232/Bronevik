'use client';

import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { RetryButton } from '@/ui-kit';

import type { SectionErrorProps } from './SectionError.types';

import s from './SectionError.module.scss';

export const SectionError = ({ onRetry, isRetrying }: SectionErrorProps) => {
  const t = useTranslations('common');

  return (
    <div className={s.root} role='alert'>
      <TriangleAlert aria-hidden className={s.icon} size={16} />
      <p className={s.text}>{t('loadErrorTitle')}</p>
      <RetryButton disabled={isRetrying} size='sm' variant='ghost' onClick={onRetry} />
    </div>
  );
};
