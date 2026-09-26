import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { NewsPage } from '@/views/news';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'news.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.news, locale, index: true, follow: true });
};

const Page = () => (
  <Suspense>
    <NewsPage />
  </Suspense>
);

export default Page;
