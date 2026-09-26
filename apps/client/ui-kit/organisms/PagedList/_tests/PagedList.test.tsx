import type { ComponentProps, ReactElement } from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { PagedList } from '../PagedList';

type Item = { id: number; title: string };

const ITEMS: Item[] = [
  { id: 1, title: 'First guide' },
  { id: 2, title: 'Second guide' }
];

const LABEL = 'Guides';
const EMPTY = 'Nothing here yet';

const BASE: ComponentProps<typeof PagedList<Item>> = {
  items: ITEMS,
  getKey: (item) => item.id,
  renderItem: (item) => item.title,
  empty: EMPTY,
  isPending: false,
  isError: false,
  onRetry: () => undefined,
  onLoadMore: () => undefined,
  label: LABEL
};

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

const region = () => screen.getByRole('region', { name: LABEL });

describe('PagedList', () => {
  it('lists every item in order', () => {
    renderWithIntl(<PagedList {...BASE} />);

    expect(
      within(region())
        .getAllByRole('listitem')
        .map((item) => item.textContent)
    ).toEqual(ITEMS.map((item) => item.title));
  });

  it('shows the empty state when there are no items', () => {
    renderWithIntl(<PagedList {...BASE} items={[]} />);

    expect(within(region()).getByText(EMPTY)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('marks itself busy while the first page loads', () => {
    renderWithIntl(<PagedList {...BASE} isPending items={[]} />);

    expect(region()).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText(EMPTY)).not.toBeInTheDocument();
  });

  it('offers a retry when the first page failed', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn<() => void>();

    renderWithIntl(<PagedList {...BASE} isError items={[]} onRetry={onRetry} />);

    await user.click(within(region()).getByRole('button', { name: messages.en.common.retry }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('keeps showing loaded items when a later page failed', () => {
    renderWithIntl(<PagedList {...BASE} isError />);

    expect(within(region()).getAllByRole('listitem')).toHaveLength(ITEMS.length);
    expect(screen.queryByRole('button', { name: messages.en.common.retry })).not.toBeInTheDocument();
  });

  it('loads the next page on demand', async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn<() => void>();

    renderWithIntl(<PagedList {...BASE} hasNextPage onLoadMore={onLoadMore} />);

    await user.click(screen.getByRole('button', { name: messages.en.common.showMore }));

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('blocks a second request while the next page is loading', () => {
    renderWithIntl(<PagedList {...BASE} hasNextPage isFetchingNextPage />);

    expect(screen.getByRole('button', { name: messages.en.common.showMore })).toBeDisabled();
  });

  it('hides the load-more control on the last page', () => {
    renderWithIntl(<PagedList {...BASE} />);

    expect(screen.queryByRole('button', { name: messages.en.common.showMore })).not.toBeInTheDocument();
  });

  it('uses a custom load-more label when given', () => {
    renderWithIntl(<PagedList {...BASE} hasNextPage moreLabel='More guides' />);

    expect(screen.getByRole('button', { name: 'More guides' })).toBeInTheDocument();
  });
});
