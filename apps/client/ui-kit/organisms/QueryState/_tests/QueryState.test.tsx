import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import type { QueryStateProps, QueryStateSource } from '../QueryState.types';

import { QueryState } from '../QueryState';

const QUERY: QueryStateSource<string[]> = { data: undefined, isError: false, refetch: vi.fn() };

const renderState = (props: Partial<QueryStateProps<string[]>>) =>
  render(
    <NextIntlClientProvider locale='ru' messages={messages.ru}>
      <QueryState empty={<p>Empty</p>} query={QUERY} skeleton={<p>Loading</p>} {...props}>
        {(items) => <p>{items.join(', ')}</p>}
      </QueryState>
    </NextIntlClientProvider>
  );

describe('QueryState', () => {
  it('shows the skeleton while nothing has loaded', () => {
    renderState({});

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders the loaded data through children', () => {
    renderState({ query: { ...QUERY, data: ['T-34', 'IS-7'] } });

    expect(screen.getByText('T-34, IS-7')).toBeInTheDocument();
  });

  it('accepts plain children when the data is read elsewhere', () => {
    render(
      <QueryState query={{ ...QUERY, data: ['T-34'] }}>
        <p>Ready</p>
      </QueryState>
    );

    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('shows the empty slot for an empty list by default', () => {
    renderState({ query: { ...QUERY, data: [] } });

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('asks the caller whether non-list data is empty', () => {
    renderState({ query: { ...QUERY, data: ['T-34'] }, isEmpty: (items) => items[0] === 'T-34' });

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('keeps showing stale data when a refetch fails', () => {
    renderState({ query: { ...QUERY, data: ['T-34'], isError: true } });

    expect(screen.getByText('T-34')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('retries through refetch when loading failed', () => {
    const refetch = vi.fn();

    renderState({ query: { ...QUERY, isError: true, refetch } });
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(refetch).toHaveBeenCalledOnce();
  });

  it('lets the caller replace the error state', () => {
    renderState({ query: { ...QUERY, isError: true }, errorState: <p>Gone</p> });

    expect(screen.getByText('Gone')).toBeInTheDocument();
  });
});
