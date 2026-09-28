import { clsx } from 'clsx';
import { getLocale } from 'next-intl/server';

import { FONT_VARIABLES } from '@/shared/config';
import { resolveLocale, routing } from '@/shared/i18n';
import { defaultMetadata, defaultViewport } from '@/shared/seo';

import { AppProviders } from '../providers/AppProviders';

import 'modern-normalize/modern-normalize.css';
import '../globals.scss';

export const metadata = defaultMetadata;

export const viewport = defaultViewport;

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

const LocaleLayout = async ({ children }: Pick<LayoutProps<'/[locale]'>, 'children'>) => {
  const locale = resolveLocale(await getLocale());

  return (
    <html suppressHydrationWarning className={clsx(FONT_VARIABLES)} data-theme='dark' lang={locale}>
      <body>
        <AppProviders locale={locale}>{children}</AppProviders>
      </body>
    </html>
  );
};

export default LocaleLayout;
