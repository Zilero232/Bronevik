'use client';

import { clsx } from 'clsx';

import { FONT_VARIABLES, SITE } from '@/shared/config';
import { DEFAULT_LOCALE, messages } from '@/shared/i18n';
import { Button, EmptyState } from '@/ui-kit';

import s from './global-error.module.scss';

import 'modern-normalize/modern-normalize.css';
import './globals.scss';

const GlobalError = ({ reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  const t = messages[DEFAULT_LOCALE].error;

  return (
    <html className={clsx(FONT_VARIABLES)} data-theme='dark' lang={SITE.lang}>
      <body>
        <main className={s.root}>
          <EmptyState action={<Button onClick={reset}>{t.retry}</Button>} code={t.code} description={t.body} title={t.title} />
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
