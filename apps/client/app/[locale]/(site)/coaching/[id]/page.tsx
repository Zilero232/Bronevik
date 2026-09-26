import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { CoachPage } from '@/views/coach';

export const generateMetadata = async ({ params }: PageProps<'/[locale]/coaching/[id]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const id = decodeURIComponent((await params).id);
  const t = await getTranslations({ locale, namespace: 'coaching.coachMeta' });

  return createPageMetadata({ title: t('title'), description: t('description'), path: ROUTES.coach(id), locale, index: true, follow: true });
};

const CoachRoute = async ({ params }: Pick<PageProps<'/[locale]/coaching/[id]'>, 'params'>) => {
  const { id } = await params;

  return <CoachPage userId={decodeURIComponent(id)} />;
};

const Page = ({ params }: PageProps<'/[locale]/coaching/[id]'>) => (
  <Suspense>
    <CoachRoute params={params} />
  </Suspense>
);

export default Page;
