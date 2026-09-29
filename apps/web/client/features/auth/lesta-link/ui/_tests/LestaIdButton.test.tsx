import type { ReactNode } from 'react';

import { act, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { LestaNoticeProvider } from '@/entities/app/lesta-notice';
import { LestaIdButton } from '@/features/auth/lesta-link';
import { messages } from '@/shared/i18n';

const LABEL = 'Войти через Lesta ID';

const renderButton = (wrap: (button: ReactNode) => ReactNode = (button) => button) =>
  act(async () => {
    render(
      <NextIntlClientProvider locale='ru' messages={messages.ru}>
        {wrap(<LestaIdButton callbackPath='/me' label={LABEL} />)}
      </NextIntlClientProvider>
    );
  });

const withNotice = (isShown: boolean) => (button: ReactNode) => (
  <LestaNoticeProvider isShown={Promise.resolve(isShown)}>{button}</LestaNoticeProvider>
);

describe('LestaIdButton', () => {
  it('is disabled with an explanation while Lesta is not connected', async () => {
    await renderButton(withNotice(true));

    expect(await screen.findByRole('button', { name: LABEL })).toBeDisabled();
    expect(screen.getByText(messages.ru.auth.lestaNotConnected)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('links to the Lesta ID sign-in once Lesta is connected', async () => {
    await renderButton(withNotice(false));

    expect(await screen.findByRole('link', { name: LABEL })).toHaveAttribute('href', expect.stringContaining('callbackURL='));
    expect(screen.queryByText(messages.ru.auth.lestaNotConnected)).not.toBeInTheDocument();
  });

  it('links to the Lesta ID sign-in outside a notice provider', async () => {
    await renderButton();

    expect(await screen.findByRole('link', { name: LABEL })).toHaveAttribute('href', expect.stringContaining('callbackURL='));
  });
});
