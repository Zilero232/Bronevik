'use client';

import { useTranslations } from 'next-intl';

import { QueryState, Skeleton } from '@/ui-kit';

import type { ShowcaseSectionsProps } from './ShowcaseSections.types';

import { useShowcaseStatus } from '../../../../../model/hooks';

import s from './ShowcaseSections.module.scss';

export const ShowcaseSections = ({ children }: ShowcaseSectionsProps) => {
  const t = useTranslations('builds.showcase');
  const query = useShowcaseStatus();

  return (
    <QueryState errorTitle={t('error')} query={query} skeleton={<Skeleton className={s.pending} height={320} />}>
      {children}
    </QueryState>
  );
};
