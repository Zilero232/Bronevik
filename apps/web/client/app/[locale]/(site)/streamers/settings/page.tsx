import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { PageHeroFallback } from '@/ui-kit';
import { StreamersSettingsPage } from '@/views/streamers-settings';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'streamerSettings.meta.list' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: ROUTES.streamers.settings.table,
    locale,
    index: true,
    follow: true
  });
};

const Page = () => (
  <Suspense fallback={<PageHeroFallback />}>
    <StreamersSettingsPage />
  </Suspense>
);

export default Page;
