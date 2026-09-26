'use client';

import { useTranslations } from 'next-intl';

import { GuideStatusBadge } from '@/features/community/guide-meta';
import { ReportButton } from '@/features/community/report-content';
import { ROUTES } from '@/shared/constants';
import { PageHeader } from '@/ui-kit';

import type { GuideHeaderProps } from './GuideHeader.types';

import { useGuideViewer } from '../../../model/hooks';
import { GuideLikeButton, GuideMeta, GuideOwnerActions } from './components';

import s from './GuideHeader.module.scss';

export const GuideHeader = ({ guide }: GuideHeaderProps) => {
  const t = useTranslations('guides.detail');
  const { isAuthor } = useGuideViewer(guide);

  return (
    <PageHeader
      actions={
        <div className={s.actions}>
          <GuideLikeButton guide={guide} />
          {isAuthor ? <GuideOwnerActions guide={guide} /> : <ReportButton targetId={guide.id} targetType='guide' />}
        </div>
      }
      breadcrumbs={[{ label: t('breadcrumb'), href: ROUTES.guides.list }, { label: guide.title }]}
      meta={guide.status === 'published' ? undefined : <GuideStatusBadge status={guide.status} />}
      title={guide.title}
    >
      <GuideMeta guide={guide} />
    </PageHeader>
  );
};
