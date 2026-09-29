import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/i18n';

import { DataNotice } from '..';

describe('DataNotice', () => {
  it('tells visitors the Lesta data is not connected yet', () => {
    render(
      <NextIntlClientProvider locale='ru' messages={messages.ru}>
        <DataNotice />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('note')).toHaveTextContent('пока не подключены');
  });

  it('speaks English on the English site', () => {
    render(
      <NextIntlClientProvider locale='en' messages={messages.en}>
        <DataNotice />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('note')).toHaveTextContent('not connected yet');
  });
});
