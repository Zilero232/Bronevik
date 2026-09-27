'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ErrorState, Skeleton } from '@/ui-kit';

import type { ShowcaseSectionsProps } from './ShowcaseSections.types';

import { useShowcaseStatus } from '../../../../../model/hooks';

import s from './ShowcaseSections.module.scss';

export const ShowcaseSections = ({ children }: ShowcaseSectionsProps) => {
  const t = useTranslations('builds.showcase');
  const { status, isRetrying, onRetry } = useShowcaseStatus();

  return match(status)
    .with('pending', () => <Skeleton className={s.pending} height={320} />)
    .with('error', () => <ErrorState isRetrying={isRetrying} title={t('error')} onRetry={onRetry} />)
    .with('ready', () => children)
    .exhaustive();
};
