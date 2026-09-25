import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { MePage } from '@/views/me';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'me.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.me, locale });
};

const Page = () => <MePage />;

export default Page;
