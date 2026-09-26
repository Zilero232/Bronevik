'use client';

import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, PageHeader } from '@/ui-kit';

import type { ReplayStatusStateProps } from './ReplayStatusState.types';

import s from './ReplayStatusState.module.scss';

export const ReplayStatusState = ({ replay }: ReplayStatusStateProps) => {
  const t = useTranslations('replays.detail');
  const isFailed = replay.status === 'failed';

  return (
    <>
      <PageHeader breadcrumbs={[{ label: t('breadcrumb'), href: ROUTES.replays.list }, { label: t('untitled') }]} title={t('untitled')} />
      <EmptyState
        action={
          <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.replays.list}>
            {t('backToList')}
          </Link>
        }
        description={t(isFailed ? 'failedDescription' : 'processingDescription')}
        icon={isFailed ? <TriangleAlert size={22} /> : <LoaderCircle className={s.spinner} size={22} />}
        title={t(isFailed ? 'failedTitle' : 'processingTitle')}
      />
    </>
  );
};
