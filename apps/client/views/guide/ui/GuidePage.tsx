'use client';

import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { CommentsThread } from '@/features/community/comments';
import { Markdown } from '@/features/community/markdown';
import { Card, ErrorState, Skeleton } from '@/ui-kit';

import type { GuidePageProps } from './GuidePage.types';

import { GUIDE_PAGE } from '../config';
import { useGuidePage } from '../model/hooks';
import { GuideHeader } from './components';

import s from './GuidePage.module.scss';

export const GuidePage = ({ slug }: GuidePageProps) => {
  const t = useTranslations('guides.detail');
  const { guide, isPending, isNotFound, isRetrying, retry } = useGuidePage(slug);

  return (
    <div className={s.root}>
      {match({ guide, isPending, isNotFound })
        .with({ guide: P.nonNullable }, ({ guide: loaded }) => (
          <>
            <GuideHeader guide={loaded} />
            {loaded.status !== 'published' && (
              <p className={s.notice} data-status={loaded.status}>
                {t(`statusNotice.${loaded.status}`)}
              </p>
            )}
            <Card className={s.content} padding='lg'>
              <Markdown>{loaded.body}</Markdown>
            </Card>
            {loaded.status === 'published' && <CommentsThread className={s.content} target='guide' targetId={loaded.id} />}
          </>
        ))
        .with({ isPending: true }, () => (
          <div aria-busy className={s.skeleton}>
            {GUIDE_PAGE.skeletonHeights.map((height) => (
              <Skeleton key={height} height={height} shape='block' />
            ))}
          </div>
        ))
        .with({ isNotFound: true }, () => notFound())
        .otherwise(() => (
          <ErrorState description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />
        ))}
    </div>
  );
};
