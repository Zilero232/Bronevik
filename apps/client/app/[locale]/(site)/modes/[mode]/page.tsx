import type { Metadata } from 'next';

import { PLAY_MODES, playModeSchema } from '@otmetki/schemas';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { ModePage } from '@/views/mode';

export const generateStaticParams = () => PLAY_MODES.map((mode) => ({ mode }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/modes/[mode]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const parsed = playModeSchema.safeParse((await params).mode);
  const t = await getTranslations({ locale, namespace: 'modes' });

  if (!parsed.success) {
    return createPageMetadata({ title: t('meta.title'), description: t('meta.description'), path: ROUTES.modes.list, locale });
  }

  const name = t(`names.${parsed.data}`);

  return createPageMetadata({
    title: t('modeMeta.title', { name }),
    description: t('modeMeta.description', { name }),
    path: ROUTES.modes.detail(parsed.data),
    locale,
    index: true,
    follow: true
  });
};

const ModeRoute = async ({ params }: Pick<PageProps<'/[locale]/modes/[mode]'>, 'params'>) => {
  const parsed = playModeSchema.safeParse((await params).mode);

  if (!parsed.success) {
    notFound();
  }

  return <ModePage mode={parsed.data} />;
};

const Page = ({ params }: PageProps<'/[locale]/modes/[mode]'>) => (
  <Suspense>
    <ModeRoute params={params} />
  </Suspense>
);

export default Page;
