import { clsx } from 'clsx';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import * as rootParams from 'next/root-params';

import { FONT_VARIABLES } from '@/shared/config';
import { routing } from '@/shared/i18n';
import { defaultMetadata, defaultViewport } from '@/shared/seo';

import { AppProviders } from '../providers/AppProviders';

import 'modern-normalize/modern-normalize.css';
import '../globals.scss';

export const metadata = defaultMetadata;

export const viewport = defaultViewport;

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

const LocaleLayout = async ({ children }: LayoutProps<'/[locale]'>) => {
  const locale = await rootParams.locale();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html suppressHydrationWarning className={clsx(FONT_VARIABLES)} data-theme='dark' lang={locale}>
      <body>
        <AppProviders locale={locale}>{children}</AppProviders>
      </body>
    </html>
  );
};

export default LocaleLayout;
