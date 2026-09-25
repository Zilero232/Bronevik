import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { TopPage } from '@/views/top';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'top.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.top, locale, index: true, follow: true });
};

const Page = () => <TopPage />;

export default Page;
