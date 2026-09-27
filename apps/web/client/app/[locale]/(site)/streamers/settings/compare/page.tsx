import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { StreamersSettingsComparePage } from '@/views/streamers-settings-compare';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'streamerSettings.meta.compare' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: ROUTES.streamers.settings.compare,
    locale,
    index: true,
    follow: true
  });
};

const Page = () => (
  <Suspense>
    <StreamersSettingsComparePage />
  </Suspense>
);

export default Page;
