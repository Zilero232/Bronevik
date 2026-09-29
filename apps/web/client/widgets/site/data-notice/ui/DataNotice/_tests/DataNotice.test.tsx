import { act, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Suspense } from 'react';
import { describe, expect, it } from 'vitest';

import { LestaNoticeProvider } from '@/entities/app/lesta-notice';
import { messages } from '@/shared/i18n';
import { DataNotice } from '@/widgets/site/data-notice';

const renderNotice = ({ locale, isShown }: { locale: 'en' | 'ru'; isShown: boolean }) =>
  act(async () => {
    render(
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        <LestaNoticeProvider isShown={Promise.resolve(isShown)}>
          <Suspense fallback={null}>
            <DataNotice />
          </Suspense>
        </LestaNoticeProvider>
      </NextIntlClientProvider>
    );
  });

describe('DataNotice', () => {
  it('tells visitors the Lesta data is not connected yet when the notice is on', async () => {
    await renderNotice({ locale: 'ru', isShown: true });

    expect(await screen.findByRole('note')).toHaveTextContent('пока не подключены');
  });

  it('speaks English on the English site', async () => {
    await renderNotice({ locale: 'en', isShown: true });

    expect(await screen.findByRole('note')).toHaveTextContent('not connected yet');
  });

  it('renders nothing when the notice is off', async () => {
    await renderNotice({ locale: 'ru', isShown: false });

    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('renders nothing outside a notice provider', () => {
    render(
      <NextIntlClientProvider locale='ru' messages={messages.ru}>
        <DataNotice />
      </NextIntlClientProvider>
    );

    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });
});
