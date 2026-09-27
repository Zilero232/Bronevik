import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { StreamerStudioPage } from '@/views/streamer-studio';

export const instant = false;

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'streamer.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.account.streamer, locale });
};

const Page = () => (
  <Suspense>
    <StreamerStudioPage />
  </Suspense>
);

export default Page;
