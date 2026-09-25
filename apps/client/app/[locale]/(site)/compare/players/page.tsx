import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { ComparePlayersPage, CompareSkeleton } from '@/views/compare-players';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'compare.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.comparePlayers, locale, index: true, follow: true });
};

const Page = () => (
  <Suspense fallback={<CompareSkeleton />}>
    <ComparePlayersPage />
  </Suspense>
);

export default Page;
