import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import type { ResourceMissingProps } from '../ResourceMissing.types';

import { ResourceMissing } from '..';

vi.mock('@/shared/i18n/navigation', () => ({
  Link: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a className={className} href={href}>
      {children}
    </a>
  )
}));

const renderMissing = (props: Partial<ResourceMissingProps>) =>
  render(
    <NextIntlClientProvider locale='ru' messages={messages.ru}>
      <ResourceMissing back={{ href: '/tanks', label: 'Back' }} reason='notFound' title='Missing' {...props} />
    </NextIntlClientProvider>
  );

describe('ResourceMissing', () => {
  it('links back without a retry when the resource does not exist', () => {
    const onRetry = vi.fn();

    renderMissing({ onRetry });

    expect(screen.getByRole('link', { name: 'Back' }).getAttribute('href')).toBe('/tanks');
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('retries through the given callback when loading failed', () => {
    const onRetry = vi.fn();

    renderMissing({ reason: 'error', onRetry });
    fireEvent.click(screen.getByRole('button'));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
