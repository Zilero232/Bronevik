'use client';

import { useTranslations } from 'next-intl';

import { CommentsThread } from '@/features/community/comments';
import { Markdown } from '@/features/community/markdown';
import { Card, Skeleton } from '@/ui-kit';
import { ResourceGate } from '@/widgets/site/resource-missing';

import type { GuidePageProps } from './GuidePage.types';

import { GUIDE_PAGE } from '../config';
import { GuideProvider } from '../model/context';
import { useGuidePage } from '../model/hooks';
import { GuideHeader } from './components';

import s from './GuidePage.module.scss';

export const GuidePage = ({ slug }: GuidePageProps) => {
  const t = useTranslations('guides.detail');
  const query = useGuidePage(slug);

  return (
    <div className={s.root}>
      <ResourceGate
        skeleton={
          <div aria-busy className={s.skeleton}>
            {GUIDE_PAGE.skeletonHeights.map((height) => (
              <Skeleton key={height} height={height} shape='block' />
            ))}
          </div>
        }
        error={{ title: t('errorTitle'), description: t('errorDescription') }}
        query={query}
      >
        {(guide) => (
          <GuideProvider guide={guide}>
            <GuideHeader />
            {guide.status !== 'published' && (
              <p className={s.notice} data-status={guide.status}>
                {t(`statusNotice.${guide.status}`)}
              </p>
            )}
            <Card className={s.content} padding='lg'>
              <Markdown>{guide.body}</Markdown>
            </Card>
            {guide.status === 'published' && <CommentsThread className={s.content} target='guide' targetId={guide.id} />}
          </GuideProvider>
        )}
      </ResourceGate>
    </div>
  );
};
