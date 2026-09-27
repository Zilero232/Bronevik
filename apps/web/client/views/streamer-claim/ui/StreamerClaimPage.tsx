'use client';

import { useTranslations } from 'next-intl';

import { ClaimProfile } from '@/features/streamer/claim-profile';
import { ROUTES } from '@/shared/constants';
import { PageHeader } from '@/ui-kit';

import type { StreamerClaimPageProps } from './StreamerClaimPage.types';

import s from './StreamerClaimPage.module.scss';

export const StreamerClaimPage = ({ slug }: StreamerClaimPageProps) => {
  const t = useTranslations('streamersDirectory');

  return (
    <div className={s.root}>
      <PageHeader
        breadcrumbs={[{ label: t('head.title'), href: ROUTES.streamers.list }, { label: slug }]}
        description={t('claim.description', { slug })}
        title={t('claim.title')}
      />
      <ClaimProfile slug={slug} />
    </div>
  );
};
