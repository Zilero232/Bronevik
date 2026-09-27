import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { ChallengesPage } from '@/views/challenges';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'social.meta.challenges' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.social.challenges, locale, index: false, follow: true });
};

const Page = () => (
  <Suspense>
    <ChallengesPage />
  </Suspense>
);

export default Page;
