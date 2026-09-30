import type { DehydratedState } from '@tanstack/react-query';

import { dehydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { connection } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PrefetchBoundary } from '../PrefetchBoundary';

vi.mock('next/server', () => ({ connection: vi.fn(() => Promise.resolve()) }));

const KEY = ['tank', 'is-7'];

const prefetched = async () => {
  const server = new QueryClient();

  await server.prefetchQuery({ queryKey: KEY, queryFn: () => Promise.resolve({ name: 'ИС-7' }) });

  return dehydrate(server);
};

const renderBoundary = async (state: Promise<DehydratedState | null>) => {
  const client = new QueryClient();

  render(<QueryClientProvider client={client}>{await PrefetchBoundary({ state, children: <p>page</p> })}</QueryClientProvider>);

  return client;
};

describe('PrefetchBoundary', () => {
  beforeEach(() => {
    vi.mocked(connection).mockClear();
  });

  it('hands the prefetched queries to the browser cache and stays static', async () => {
    const client = await renderBoundary(prefetched());

    expect(screen.getByText('page')).toBeInTheDocument();
    expect(client.getQueryData(KEY)).toEqual({ name: 'ИС-7' });
    expect(connection).not.toHaveBeenCalled();
  });

  it('renders the page at request time with an empty cache when the prefetch found no state', async () => {
    const client = await renderBoundary(Promise.resolve(null));

    expect(screen.getByText('page')).toBeInTheDocument();
    expect(client.getQueryCache().getAll()).toEqual([]);
    expect(connection).toHaveBeenCalledOnce();
  });

  it('still renders the page with an empty cache when the prefetch failed', async () => {
    const client = await renderBoundary(Promise.reject(new Error('API down')));

    expect(screen.getByText('page')).toBeInTheDocument();
    expect(client.getQueryCache().getAll()).toEqual([]);
    expect(connection).toHaveBeenCalledOnce();
  });
});
