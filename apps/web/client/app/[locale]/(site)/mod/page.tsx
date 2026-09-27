import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { ModPage } from '@/views/mod';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'mod.meta' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: ROUTES.mod,
    locale,
    index: true,
    follow: true
  });
};

const Page = () => <ModPage />;

export default Page;
