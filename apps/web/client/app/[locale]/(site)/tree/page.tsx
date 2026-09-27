import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { TreePage } from '@/views/tree';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'tree.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.tree, locale, index: true, follow: true });
};

const Page = () => (
  <Suspense>
    <TreePage />
  </Suspense>
);

export default Page;
