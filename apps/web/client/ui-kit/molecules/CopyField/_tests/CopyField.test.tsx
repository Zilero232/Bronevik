import type { ReactElement } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { CopyField } from '../CopyField';

const SECRET = 'sk_live_abcdef';

const writeText = vi.fn<(text: string) => Promise<void>>();

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

beforeEach(() => {
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
});

afterEach(() => {
  Reflect.deleteProperty(navigator, 'clipboard');
  writeText.mockReset();
});

describe('CopyField', () => {
  it('shows a plain value as is', () => {
    renderWithIntl(<CopyField value={SECRET} />);

    expect(screen.getByText(SECRET)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: messages.en.common.show })).not.toBeInTheDocument();
  });

  it('masks a secret until it is revealed', () => {
    renderWithIntl(<CopyField isSecret value={SECRET} />);

    expect(screen.queryByText(SECRET)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: messages.en.common.show }));

    expect(screen.getByText(SECRET)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.en.common.hide })).toBeInTheDocument();
  });

  it('hides the length of a very long secret behind a capped mask', () => {
    const longSecret = 'x'.repeat(200);

    renderWithIntl(<CopyField isSecret value={longSecret} />);

    const masked = screen.getByText(/^•+$/);

    expect(masked.textContent?.length).toBeLessThan(longSecret.length);
  });

  it('copies the real value of a masked secret and confirms it', async () => {
    const onCopy = vi.fn<() => void>();

    renderWithIntl(<CopyField isSecret value={SECRET} onCopy={onCopy} />);

    fireEvent.click(screen.getByRole('button', { name: messages.en.common.copy }));

    expect(await screen.findByRole('button', { name: messages.en.common.copied })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith(SECRET);
    expect(onCopy).toHaveBeenCalledOnce();
  });
});
