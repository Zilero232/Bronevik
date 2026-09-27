'use client';

import { clsx } from 'clsx';

import { usePathnameLocale } from '@/entities/app/locale';
import { FONT_VARIABLES } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { localePath, messages } from '@/shared/i18n';
import { Button, buttonVariants, EmptyState } from '@/ui-kit';

import type { GlobalErrorProps } from './global-error.types';

import s from './global-error.module.scss';

import 'modern-normalize/modern-normalize.css';
import './globals.scss';

const GlobalError = ({ reset }: GlobalErrorProps) => {
  const locale = usePathnameLocale();

  const t = messages[locale].error;

  return (
    <html className={clsx(FONT_VARIABLES)} data-theme='dark' lang={locale}>
      <body>
        <main className={s.root}>
          <EmptyState
            action={
              <div className={s.actions}>
                <Button onClick={reset}>{t.retry}</Button>
                <a className={buttonVariants({ variant: 'secondary' })} href={localePath({ path: ROUTES.home, locale })}>
                  {t.home}
                </a>
              </div>
            }
            description={t.body}
            title={t.title}
          />
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
