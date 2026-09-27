import type { DehydratedState } from '@tanstack/react-query';

import { dehydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PrefetchBoundary } from '../PrefetchBoundary';

const KEY = ['tank', 'is-7'];

const prefetched = async () => {
  const server = new QueryClient();

  await server.prefetchQuery({ queryKey: KEY, queryFn: () => Promise.resolve({ name: 'ИС-7' }) });

  return dehydrate(server);
};

const renderBoundary = async (state: Promise<DehydratedState>) => {
  const client = new QueryClient();

  render(<QueryClientProvider client={client}>{await PrefetchBoundary({ state, children: <p>page</p> })}</QueryClientProvider>);

  return client;
};

describe('PrefetchBoundary', () => {
  it('hands the prefetched queries to the browser cache', async () => {
    const client = await renderBoundary(prefetched());

    expect(screen.getByText('page')).toBeInTheDocument();
    expect(client.getQueryData(KEY)).toEqual({ name: 'ИС-7' });
  });

  it('still renders the page with an empty cache when the prefetch failed', async () => {
    const client = await renderBoundary(Promise.reject(new Error('API down')));

    expect(screen.getByText('page')).toBeInTheDocument();
    expect(client.getQueryCache().getAll()).toEqual([]);
  });
});
