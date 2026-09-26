import type { ReactElement } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/i18n';

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../Dialog';

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

const DIALOG = (
  <Dialog>
    <DialogTrigger>Open</DialogTrigger>
    <DialogContent>
      <DialogTitle>Delete build</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogContent>
  </Dialog>
);

describe('Dialog', () => {
  it('opens a dialog named by its title and described by its description', async () => {
    const user = userEvent.setup();

    renderWithIntl(DIALOG);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open' }));

    const dialog = await screen.findByRole('dialog', { name: 'Delete build' });

    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
  });

  it('closes from its own translated close button', async () => {
    const user = userEvent.setup();

    renderWithIntl(DIALOG);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('button', { name: messages.en.common.close }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();

    renderWithIntl(DIALOG);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
