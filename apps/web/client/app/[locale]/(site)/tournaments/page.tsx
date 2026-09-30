import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { PageHeroFallback } from '@/ui-kit';
import { CompetitionList, CreateCompetitionDialog } from '@/views/competitions';
import { TournamentsPage } from '@/views/tournaments';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'tournaments.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.tournaments.list, locale, index: true, follow: true });
};

const Page = () => (
  <Suspense fallback={<PageHeroFallback />}>
    <TournamentsPage points={<CompetitionList />} pointsAction={<CreateCompetitionDialog />} />
  </Suspense>
);

export default Page;
