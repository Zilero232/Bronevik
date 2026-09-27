import type { ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { ErrorState } from '../ErrorState';

const COMMON = messages.en.common;

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

describe('ErrorState', () => {
  it('falls back to the generic load error copy', () => {
    renderWithIntl(<ErrorState onRetry={vi.fn()} />);

    expect(screen.getByRole('heading', { name: COMMON.loadErrorTitle })).toBeInTheDocument();
    expect(screen.getByText(COMMON.loadErrorDescription)).toBeInTheDocument();
  });

  it('prefers the given title and description', () => {
    renderWithIntl(<ErrorState description='Try later' title='Replays are down' onRetry={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Replays are down' })).toBeInTheDocument();
    expect(screen.getByText('Try later')).toBeInTheDocument();
    expect(screen.queryByText(COMMON.loadErrorTitle)).not.toBeInTheDocument();
  });

  it('drops the description in the compact form', () => {
    renderWithIntl(<ErrorState isCompact onRetry={vi.fn()} />);

    expect(screen.getByText(COMMON.loadErrorTitle)).toBeInTheDocument();
    expect(screen.queryByText(COMMON.loadErrorDescription)).not.toBeInTheDocument();
  });

  it('retries on click', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn<() => void>();

    renderWithIntl(<ErrorState onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: COMMON.retry }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('blocks another retry while one is running', () => {
    renderWithIntl(<ErrorState isRetrying onRetry={vi.fn()} />);

    expect(screen.getByRole('button', { name: COMMON.retry })).toBeDisabled();
  });
});
