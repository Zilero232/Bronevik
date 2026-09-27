import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { PrefetchBoundary } from '@/shared/seo/prefetch-boundary';
import { TanksPage } from '@/views/tanks';
import { tanksPageState } from '@/views/tanks/server';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'tanks.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.tanks.list, locale, index: true, follow: true });
};

const Page = ({ searchParams }: PageProps<'/[locale]/tanks'>) => (
  <Suspense>
    <PrefetchBoundary state={searchParams.then(tanksPageState)}>
      <TanksPage />
    </PrefetchBoundary>
  </Suspense>
);

export default Page;
