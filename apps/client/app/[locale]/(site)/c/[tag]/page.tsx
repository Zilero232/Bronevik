import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { getClan, listClans } from '@/shared/api/clans';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { ClanPage } from '@/views/clan';

type PageProps = {
  params: Promise<{ tag: string }>;
};

const nameOf = async (value: string) => {
  'use cache';

  try {
    const { clan } = await getClan({ idOrTag: value });

    return `[${clan.tag}] ${clan.name}`;
  } catch {
    return decodeURIComponent(value);
  }
};

const STATIC_PARAMS = { limit: 20, fallback: [{ tag: 'KOPTE' }] } as const;

export const generateStaticParams = async () => {
  'use cache';

  try {
    const params = (await listClans({ limit: STATIC_PARAMS.limit })).items.map(({ clan }) => ({ tag: clan.tag }));

    return params.length > 0 ? params : [...STATIC_PARAMS.fallback];
  } catch {
    return [...STATIC_PARAMS.fallback];
  }
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { tag } = await params;
  const t = await getTranslations({ locale, namespace: 'clans.clanMeta' });
  const name = await nameOf(tag);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.clan(tag),
    locale,
    index: true,
    follow: true
  });
};

const Page = () => (
  <Suspense>
    <ClanPage />
  </Suspense>
);

export default Page;
