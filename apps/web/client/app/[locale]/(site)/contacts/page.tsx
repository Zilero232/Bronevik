import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

import { LEGAL } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { LegalPage } from '@/views/legal';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'legal.docs.contacts' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: ROUTES.legal.contacts,
    locale,
    index: !LEGAL.isDraft,
    follow: true
  });
};

const Page = () => <LegalPage doc='contacts' />;

export default Page;
