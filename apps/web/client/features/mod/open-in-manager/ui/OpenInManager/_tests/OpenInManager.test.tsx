import type { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { managerLink } from '@/features/mod/open-in-manager/lib/manager-link';
import { ROUTES } from '@/shared/constants';
import { messages } from '@/shared/i18n';

import type { OpenInManagerProps } from '../OpenInManager.types';

import { OpenInManager } from '../OpenInManager';

vi.mock('@/shared/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>
}));

const COPY = messages.en.mod.manager;
const TARGET: OpenInManagerProps['target'] = { kind: 'install', preset: 'streamer' };

const renderButton = () =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en}>
      <OpenInManager target={TARGET} />
    </NextIntlClientProvider>
  );

describe('OpenInManager', () => {
  it('links the button to the manager deep link of the target', () => {
    renderButton();

    expect(screen.getByRole('link', { name: COPY.open })).toHaveAttribute('href', managerLink(TARGET));
  });

  it('keeps the install hint hidden until the player tries the link', () => {
    renderButton();

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('points to the manager download once the link was clicked', async () => {
    const stayOnPage = (event: MouseEvent) => event.preventDefault();

    window.addEventListener('click', stayOnPage);
    renderButton();

    await userEvent.click(screen.getByRole('link', { name: COPY.open }));
    window.removeEventListener('click', stayOnPage);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toContain(ROUTES.mod);
  });
});
