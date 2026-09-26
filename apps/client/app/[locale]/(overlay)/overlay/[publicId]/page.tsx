import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { OverlayPage } from '@/views/overlay';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'overlay.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), locale });
};

const OverlayRoute = async ({ params }: Pick<PageProps<'/[locale]/overlay/[publicId]'>, 'params'>) => {
  const { publicId } = await params;

  return <OverlayPage publicId={decodeURIComponent(publicId)} />;
};

const Page = ({ params }: PageProps<'/[locale]/overlay/[publicId]'>) => (
  <Suspense>
    <OverlayRoute params={params} />
  </Suspense>
);

export default Page;
