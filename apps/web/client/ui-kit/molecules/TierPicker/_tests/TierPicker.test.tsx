import type { ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { TierPicker } from '../TierPicker';

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

const tierButton = (tier: number) => screen.getByRole('button', { name: messages.en.common.tier.replace('{tier}', String(tier)) });

describe('TierPicker', () => {
  it('adds the clicked tier to the selection', async () => {
    const onChange = vi.fn();

    renderWithIntl(<TierPicker aria-label='Tier' value={[6]} onChange={onChange} />);
    await userEvent.click(tierButton(8));

    expect(onChange).toHaveBeenLastCalledWith([6, 8]);
  });

  it('fills a span on shift-click after a first pick', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = renderWithIntl(<TierPicker aria-label='Tier' value={[]} onChange={onChange} />);

    await user.click(tierButton(6));

    rerender(
      <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
        <TierPicker aria-label='Tier' value={[6]} onChange={onChange} />
      </NextIntlClientProvider>
    );

    await user.keyboard('{Shift>}');
    await user.click(tierButton(8));
    await user.keyboard('{/Shift}');

    expect(onChange).toHaveBeenLastCalledWith([6, 7, 8]);
  });

  it('marks the picked tiers pressed', () => {
    renderWithIntl(<TierPicker aria-label='Tier' value={[10]} onChange={vi.fn()} />);

    expect(tierButton(10)).toHaveAttribute('aria-pressed', 'true');
    expect(tierButton(9)).toHaveAttribute('aria-pressed', 'false');
  });
});
