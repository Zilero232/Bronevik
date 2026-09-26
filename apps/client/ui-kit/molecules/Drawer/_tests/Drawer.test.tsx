import type { ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { Drawer } from '../Drawer';

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

describe('Drawer', () => {
  it('renders nothing while closed', () => {
    renderWithIntl(
      <Drawer open={false} title='Filters' onOpenChange={vi.fn()}>
        Drawer body
      </Drawer>
    );

    expect(screen.queryByText('Drawer body')).not.toBeInTheDocument();
  });

  it('shows a dialog named by its title with the content', () => {
    renderWithIntl(
      <Drawer open title='Filters' onOpenChange={vi.fn()}>
        Drawer body
      </Drawer>
    );

    expect(screen.getByRole('dialog', { name: 'Filters' })).toHaveTextContent('Drawer body');
  });

  it('asks to close from its translated close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();

    renderWithIntl(
      <Drawer open title='Filters' onOpenChange={onOpenChange}>
        Drawer body
      </Drawer>
    );

    await user.click(screen.getByRole('button', { name: messages.en.common.close }));

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});
