import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { TelegramLoginPage } from '@/views/telegram-login';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'telegram.webLogin.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.loginTelegram, locale });
};

const Page = () => (
  <Suspense>
    <TelegramLoginPage />
  </Suspense>
);

export default Page;
