import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { MissionsPage } from '@/views/missions';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'missions.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.missions, locale, index: true, follow: true });
};

const Page = () => (
  <Suspense>
    <MissionsPage />
  </Suspense>
);

export default Page;
