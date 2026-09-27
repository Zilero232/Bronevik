import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { LegalPage } from '@/views/legal';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'legal.docs.privacy' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.legal.privacy, locale, index: true, follow: true });
};

const Page = () => <LegalPage doc='privacy' />;

export default Page;
