import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { MiniAppPage } from '@/views/mini-app';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'tg.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.miniApp, locale });
};

const Page = () => <MiniAppPage />;

export default Page;
