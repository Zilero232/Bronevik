import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { PageHeroFallback } from '@/ui-kit';
import { ReplaysPage } from '@/views/replays';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'replays.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.replays.list, locale, index: true, follow: true });
};

const Page = () => (
  <Suspense fallback={<PageHeroFallback />}>
    <ReplaysPage />
  </Suspense>
);

export default Page;
