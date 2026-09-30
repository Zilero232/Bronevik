import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { PageHeroFallback } from '@/ui-kit';
import { GuessTankPage } from '@/views/play';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'play.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.play.guessTank, locale, index: true, follow: true });
};

const Page = () => (
  <Suspense fallback={<PageHeroFallback />}>
    <GuessTankPage />
  </Suspense>
);

export default Page;
