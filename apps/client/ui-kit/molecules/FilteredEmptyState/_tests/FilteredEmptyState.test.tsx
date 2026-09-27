import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { FilteredEmptyState } from '../FilteredEmptyState';

const renderState = (isFiltered: boolean, onReset = vi.fn()) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en}>
      <FilteredEmptyState isFiltered={isFiltered} title='Nothing found' onReset={onReset} />
    </NextIntlClientProvider>
  );

describe('FilteredEmptyState', () => {
  it('offers no reset while nothing is filtered', () => {
    renderState(false);

    expect(screen.getByText('Nothing found')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('resets the filters that emptied the list', () => {
    const onReset = vi.fn();

    renderState(true, onReset);
    fireEvent.click(screen.getByRole('button', { name: messages.en.common.resetFilters }));

    expect(onReset).toHaveBeenCalledOnce();
  });
});
