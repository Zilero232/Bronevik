import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { PlusPage } from '@/views/plus';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'plus.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.plus, locale, index: true, follow: true });
};

const Page = () => (
  <Suspense>
    <PlusPage />
  </Suspense>
);

export default Page;
