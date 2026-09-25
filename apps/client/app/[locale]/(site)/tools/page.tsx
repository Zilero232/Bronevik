import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { ToolsPage } from '@/views/tools';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'tools.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.tools, locale, index: true, follow: true });
};

const Page = () => (
  <Suspense>
    <ToolsPage />
  </Suspense>
);

export default Page;
