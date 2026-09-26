import type { StreamerClaim } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { QUERY_KEYS } from '@/shared/constants';
import { messages } from '@/shared/i18n';

import { startClaim } from '../../../../api';
import { useManualClaimForm } from '../use-manual-claim-form';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../../../api', () => ({ startClaim: vi.fn() }));

const TEXT = messages.en.streamersDirectory.claim;
const SLUG = 'jove';
const EVIDENCE = 'https://twitch.tv/jove/about mentions the page';
const EVIDENCE_LABEL = 'Evidence';
const SUBMIT_LABEL = 'Send';
const ERROR_TEXT = 'Too short';

const CLAIM: StreamerClaim = {
  id: '00000000-0000-4000-8000-000000000001',
  slug: SLUG,
  method: 'manual',
  status: 'open',
  code: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  resolvedAt: null
};

const ManualForm = () => {
  const { register, errors, isSubmitting, onSubmit } = useManualClaimForm(SLUG);

  return (
    <form noValidate onSubmit={onSubmit}>
      <textarea aria-label={EVIDENCE_LABEL} {...register('evidence')} />
      {errors.evidence && <p role='alert'>{ERROR_TEXT}</p>}
      <button disabled={isSubmitting} type='submit'>
        {SUBMIT_LABEL}
      </button>
    </form>
  );
};

const renderForm = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  render(<ManualForm />, { wrapper });

  return { client, user: userEvent.setup() };
};

describe('useManualClaimForm', () => {
  it('rejects evidence that is too short without calling the server', async () => {
    const { user } = renderForm();

    await user.type(screen.getByLabelText(EVIDENCE_LABEL), 'short');
    await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(startClaim).not.toHaveBeenCalled();
  });

  it('sends trimmed evidence as a manual claim and stores the result', async () => {
    vi.mocked(startClaim).mockResolvedValue(CLAIM);
    const { client, user } = renderForm();

    await user.type(screen.getByLabelText(EVIDENCE_LABEL), `  ${EVIDENCE}  `);
    await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.manual.sent));
    expect(startClaim).toHaveBeenCalledWith({ slug: SLUG, method: 'manual', evidence: EVIDENCE });
    expect(client.getQueryData(QUERY_KEYS.streamers.claim(SLUG))).toEqual(CLAIM);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('reports a failed submission', async () => {
    vi.mocked(startClaim).mockRejectedValue(new Error('down'));
    const { user } = renderForm();

    await user.type(screen.getByLabelText(EVIDENCE_LABEL), EVIDENCE);
    await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(TEXT.failed));
    expect(toast.success).not.toHaveBeenCalled();
  });
});
