import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { LoginPage } from '@/views/login';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'auth.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.auth.login, locale });
};

const Page = () => (
  <Suspense>
    <LoginPage />
  </Suspense>
);

export default Page;
