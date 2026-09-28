import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/i18n';

import { DemoBanner } from '..';

describe('DemoBanner', () => {
  it('tells visitors the data is generated', () => {
    render(
      <NextIntlClientProvider locale='ru' messages={messages.ru}>
        <DemoBanner />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('note')).toHaveTextContent('Демо-данные');
  });
});
