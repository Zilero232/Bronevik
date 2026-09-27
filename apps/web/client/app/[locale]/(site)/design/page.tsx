import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { DesignPage } from '@/views/design';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'design.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.design, locale });
};

const Page = () => <DesignPage />;

export default Page;
