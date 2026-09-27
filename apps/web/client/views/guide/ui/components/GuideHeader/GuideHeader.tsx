'use client';

import { useTranslations } from 'next-intl';

import { GuideStatusBadge } from '@/features/community/guide-meta';
import { ReportButton } from '@/features/community/report-content';
import { ROUTES } from '@/shared/constants';
import { PageHeader } from '@/ui-kit';

import { useGuide } from '../../../model/context';
import { useGuideViewer } from '../../../model/hooks';
import { GuideLikeButton, GuideMeta, GuideOwnerActions } from './components';

import s from './GuideHeader.module.scss';

export const GuideHeader = () => {
  const t = useTranslations('guides.detail');
  const guide = useGuide();
  const { isAuthor } = useGuideViewer();

  return (
    <PageHeader
      actions={
        <div className={s.actions}>
          <GuideLikeButton />
          {isAuthor ? <GuideOwnerActions /> : <ReportButton targetId={guide.id} targetType='guide' />}
        </div>
      }
      breadcrumbs={[{ label: t('breadcrumb'), href: ROUTES.guides.list }, { label: guide.title }]}
      meta={guide.status === 'published' ? undefined : <GuideStatusBadge status={guide.status} />}
      title={guide.title}
    >
      <GuideMeta />
    </PageHeader>
  );
};
