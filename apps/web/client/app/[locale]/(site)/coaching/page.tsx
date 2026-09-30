import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { PageHeroFallback } from '@/ui-kit';
import { CoachingPage } from '@/views/coaching';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'coaching.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.coaching.list, locale, index: true, follow: true });
};

const Page = () => (
  <Suspense fallback={<PageHeroFallback />}>
    <CoachingPage />
  </Suspense>
);

export default Page;
