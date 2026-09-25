import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { OverlayPage } from '@/views/overlay';

type PageProps = {
  params: Promise<{ publicId: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'overlay.meta' });

  return createPageMetadata({ title: t('title'), description: t('description'), locale });
};

const OverlayRoute = async ({ params }: PageProps) => {
  const { publicId } = await params;

  return <OverlayPage publicId={decodeURIComponent(publicId)} />;
};

const Page = ({ params }: PageProps) => (
  <Suspense>
    <OverlayRoute params={params} />
  </Suspense>
);

export default Page;
