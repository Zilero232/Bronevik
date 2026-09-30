import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { RequestTime } from '@/shared/seo/request-time';
import { PageHeroFallback } from '@/ui-kit';
import { BlogEditorPage } from '@/views/blog-editor';

export const generateMetadata = async () => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'blog.editorMeta' });

  return createPageMetadata({ title: t('listTitle'), description: t('description'), path: ROUTES.blog.editor.list, locale });
};

const Page = () => (
  <>
    <Suspense fallback={<PageHeroFallback />}>
      <BlogEditorPage />
    </Suspense>
    <Suspense>
      <RequestTime />
    </Suspense>
  </>
);

export default Page;
