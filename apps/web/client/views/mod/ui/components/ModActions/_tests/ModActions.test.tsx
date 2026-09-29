import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { MOD_DISTRIBUTION } from '@/shared/config';
import { messages } from '@/shared/i18n';

import { useModPage } from '../../../../model/hooks';
import { ModActions } from '../ModActions';

vi.mock('../../../../model/hooks', () => ({ useModPage: vi.fn() }));

type ModPage = ReturnType<typeof useModPage>;

const COPY = messages.en.mod.hero;
const MOST_URL = 'https://most.example/otmetki';
const PUBLISHED: ModPage['downloads'] = {
  isPreparing: false,
  manager: { version: '0.2.0', size: '8.4 MB' },
  modpack: { version: '0.10.0', size: '1.2 MB' }
};

const renderActions = ({
  distribution = {},
  downloads = PUBLISHED
}: { distribution?: Partial<ModPage['distribution']>; downloads?: ModPage['downloads'] } = {}) => {
  vi.mocked(useModPage).mockReturnValue({
    isSignedIn: false,
    isSessionPending: false,
    bindHref: '/login',
    distribution: { ...MOD_DISTRIBUTION, ...distribution },
    downloads
  });

  return render(
    <NextIntlClientProvider locale='en' messages={messages.en}>
      <ModActions />
    </NextIntlClientProvider>
  );
};

describe('ModActions', () => {
  it('makes the manager installer the primary download', () => {
    renderActions();

    const manager = screen.getByRole('link', { name: COPY.download });

    expect(manager).toHaveAttribute('href', MOD_DISTRIBUTION.managerUrl);
    expect(manager).toHaveAttribute('download', MOD_DISTRIBUTION.managerFileName);
    expect(manager).toHaveAttribute('target', '_blank');
  });

  it('keeps the packages as the manual download', () => {
    renderActions();

    expect(screen.getByRole('link', { name: COPY.manual })).toHaveAttribute('href', MOD_DISTRIBUTION.packagesUrl);
  });

  it('shows the published version and size of each file', () => {
    renderActions();

    expect(screen.getByText(/version 0\.2\.0 · 8\.4 MB/)).toBeInTheDocument();
    expect(screen.getByText(/version 0\.10\.0, 1\.2 MB/)).toBeInTheDocument();
  });

  it('disables both downloads and explains why before the first release', () => {
    renderActions({ downloads: { isPreparing: true, manager: null, modpack: null } });

    expect(screen.getByRole('button', { name: COPY.download })).toBeDisabled();
    expect(screen.getByRole('button', { name: COPY.manual })).toBeDisabled();
    expect(screen.queryByRole('link', { name: COPY.download })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(COPY.preparing);
  });

  it('keeps the downloads disabled and silent while the status loads', () => {
    renderActions({ downloads: { isPreparing: false, manager: null, modpack: null } });

    expect(screen.getByRole('button', { name: COPY.download })).toBeDisabled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows the MOST badge until the MOST link is set', () => {
    renderActions({ distribution: { mostUrl: null } });

    expect(screen.getByText(COPY.mostPending)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: COPY.most })).not.toBeInTheDocument();
  });

  it('links to MOST once the entry is live', () => {
    renderActions({ distribution: { mostUrl: MOST_URL } });

    expect(screen.getByRole('link', { name: COPY.most })).toHaveAttribute('href', MOST_URL);
    expect(screen.queryByText(COPY.mostPending)).not.toBeInTheDocument();
  });
});
