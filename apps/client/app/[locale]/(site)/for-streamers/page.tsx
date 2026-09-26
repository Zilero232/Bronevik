import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { StreamersPage } from '@/views/streamers';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'streamers.meta' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: ROUTES.streamers.forStreamers,
    locale,
    index: true,
    follow: true
  });
};

const Page = () => <StreamersPage />;

export default Page;
