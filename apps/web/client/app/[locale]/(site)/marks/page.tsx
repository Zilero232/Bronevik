import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { PrefetchBoundary } from '@/shared/seo/prefetch-boundary';
import { PageHeroFallback } from '@/ui-kit';
import { MarksPage } from '@/views/marks';
import { marksPageState } from '@/views/marks/server';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'marks.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.marks, locale, index: true, follow: true });
};

const Page = ({ searchParams }: PageProps<'/[locale]/marks'>) => (
  <Suspense fallback={<PageHeroFallback />}>
    <PrefetchBoundary state={searchParams.then(marksPageState)}>
      <MarksPage />
    </PrefetchBoundary>
  </Suspense>
);

export default Page;
