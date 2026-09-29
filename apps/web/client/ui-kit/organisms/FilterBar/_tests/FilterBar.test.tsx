import type { ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { FilterBar } from '../FilterBar';

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

describe('FilterBar', () => {
  it('keeps reset disabled while nothing is filtered', () => {
    renderWithIntl(
      <FilterBar onReset={vi.fn()}>
        <span>fields</span>
      </FilterBar>
    );

    expect(screen.getAllByRole('button', { name: messages.en.common.filters.reset })[0]).toBeDisabled();
  });

  it('removes a single filter from its chip and resets them all', async () => {
    const onRemove = vi.fn();
    const onReset = vi.fn();
    const label = 'Tier: VIII';

    renderWithIntl(
      <FilterBar active={[{ id: 'tier', label, onRemove }]} onReset={onReset}>
        <span>fields</span>
      </FilterBar>
    );

    await userEvent.click(screen.getByRole('button', { name: messages.en.common.filters.remove.replace('{label}', label) }));
    await userEvent.click(screen.getAllByRole('button', { name: messages.en.common.filters.reset })[0]);

    expect(onRemove).toHaveBeenCalledOnce();
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('shows the extra fields only after the toggle', async () => {
    renderWithIntl(
      <FilterBar more={<span>advanced field</span>} moreLabel='More'>
        <span>fields</span>
      </FilterBar>
    );

    expect(screen.queryByText('advanced field')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'More' }));

    expect(screen.getByText('advanced field')).toBeInTheDocument();
  });
});
