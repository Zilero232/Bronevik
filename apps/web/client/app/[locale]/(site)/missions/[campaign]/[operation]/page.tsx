import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { RequestTime } from '@/shared/seo/request-time';
import { PageHeroFallback } from '@/ui-kit';
import { MissionOperationPage } from '@/views/mission-operation';

export const generateMetadata = async ({ params }: PageProps<'/[locale]/missions/[campaign]/[operation]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { campaign, operation } = await params;
  const t = await getTranslations({ locale, namespace: 'missions.operationMeta' });

  return createPageMetadata({
    title: t('title', { id: operation }),
    description: t('description'),
    path: ROUTES.missions.operation({ campaign: Number(campaign), operation: Number(operation) }),
    locale,
    index: true,
    follow: true
  });
};

const Page = () => (
  <>
    <Suspense fallback={<PageHeroFallback />}>
      <MissionOperationPage />
    </Suspense>
    <Suspense>
      <RequestTime />
    </Suspense>
  </>
);

export default Page;
