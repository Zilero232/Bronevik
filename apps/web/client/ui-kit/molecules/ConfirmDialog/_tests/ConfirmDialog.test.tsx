import type { ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { ConfirmDialog } from '../ConfirmDialog';

const LABELS = { title: 'Delete build?', description: 'This cannot be undone.', confirmLabel: 'Delete', cancelLabel: 'Keep' };

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

describe('ConfirmDialog', () => {
  it('asks as an alert dialog named by its title', () => {
    renderWithIntl(<ConfirmDialog open {...LABELS} onConfirm={vi.fn()} onOpenChange={vi.fn()} />);

    expect(screen.getByRole('alertdialog', { name: LABELS.title })).toHaveAccessibleDescription(LABELS.description);
  });

  it('confirms without closing on its own', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn<() => void>();
    const onOpenChange = vi.fn<(open: boolean) => void>();

    renderWithIntl(<ConfirmDialog open {...LABELS} onConfirm={onConfirm} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: LABELS.confirmLabel }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('cancels by closing without confirming', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn<() => void>();
    const onOpenChange = vi.fn<(open: boolean) => void>();

    renderWithIntl(<ConfirmDialog open {...LABELS} onConfirm={onConfirm} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: LABELS.cancelLabel }));

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('blocks a second confirm while the first is pending', () => {
    renderWithIntl(<ConfirmDialog isPending open {...LABELS} onConfirm={vi.fn()} onOpenChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: LABELS.confirmLabel })).toBeDisabled();
    expect(screen.getByRole('button', { name: LABELS.cancelLabel })).toBeEnabled();
  });

  it('renders extra content and keeps confirm locked until the caller allows it', () => {
    renderWithIntl(
      <ConfirmDialog isConfirmDisabled open {...LABELS} onConfirm={vi.fn()} onOpenChange={vi.fn()}>
        <input aria-label='Nickname' />
      </ConfirmDialog>
    );

    expect(screen.getByRole('textbox', { name: 'Nickname' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: LABELS.confirmLabel })).toBeDisabled();
  });

  it('opens from its trigger when uncontrolled', async () => {
    const user = userEvent.setup();

    renderWithIntl(<ConfirmDialog {...LABELS} trigger={<button type='button'>Remove</button>} onConfirm={vi.fn()} />);

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(await screen.findByRole('alertdialog', { name: LABELS.title })).toBeInTheDocument();
  });
});
