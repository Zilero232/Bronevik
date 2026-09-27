import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { QUERY_KEYS } from '@/shared/constants';
import { messages } from '@/shared/i18n';

import type { ContentReport } from '../../../../api';
import type { ReportTarget } from '../../../../lib/report-form';

import { createReport } from '../../../../api/moderation/moderation';
import { REPORT_FORM_DEFAULT_VALUES, REPORT_REASONS } from '../../../../config';
import { useReportForm } from '../use-report-form';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../../../api/moderation/moderation', () => ({ createReport: vi.fn() }));

const TEXT = messages.en.community.report;
const TARGET: ReportTarget = { targetType: 'comment', targetId: 'comment-1' };
const SESSION: AuthSession = {
  user: { id: 'user-1', name: 'Tanker', email: 'user-1@example.com', emailVerified: false, createdAt: new Date(0), updatedAt: new Date(0) },
  lestaAccountId: null
};

const REPORT: ContentReport = {
  id: '00000000-0000-4000-8000-000000000001',
  targetType: TARGET.targetType,
  targetId: TARGET.targetId,
  reason: 'cheating',
  details: 'aimbot',
  status: 'open',
  reporterUserId: 'user-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  resolvedAt: null
};

const setup = (session: AuthSession) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  client.setQueryData(QUERY_KEYS.auth.session, session);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return renderHook(() => useReportForm(TARGET), { wrapper });
};

const openWithDraft = (result: ReturnType<typeof setup>['result']) => {
  act(() => result.current.onOpenChange(true));

  act(() => {
    result.current.form.setValue('reason', 'cheating');
    result.current.form.setValue('details', '  aimbot  ');
  });
};

describe('useReportForm', () => {
  it('knows whether the viewer can report', () => {
    expect(setup(SESSION).result.current.isSignedIn).toBe(true);
    expect(setup(null).result.current.isSignedIn).toBe(false);
  });

  it('offers every server reason with a translated label', () => {
    const { result } = setup(SESSION);

    expect(result.current.reasons.map(({ value }) => value)).toEqual(REPORT_REASONS);
    expect(result.current.reasons.find(({ value }) => value === 'spam')?.label).toBe(TEXT.reasons.spam);
  });

  it('sends the report with trimmed details, closes the dialog and clears the draft', async () => {
    vi.mocked(createReport).mockResolvedValue(REPORT);
    const { result } = setup(SESSION);

    openWithDraft(result);
    await act(() => result.current.onSubmit());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.sent));
    expect(vi.mocked(createReport).mock.calls[0]?.[0]).toEqual({ ...TARGET, reason: 'cheating', details: 'aimbot' });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.form.getValues()).toEqual(REPORT_FORM_DEFAULT_VALUES);
  });

  it('leaves out empty details', async () => {
    vi.mocked(createReport).mockResolvedValue(REPORT);
    const { result } = setup(SESSION);

    act(() => result.current.form.setValue('details', '   '));
    await act(() => result.current.onSubmit());

    await waitFor(() => expect(createReport).toHaveBeenCalledOnce());
    expect(vi.mocked(createReport).mock.calls[0]?.[0]).not.toHaveProperty('details');
  });

  it('keeps the dialog and the draft open when sending fails', async () => {
    vi.mocked(createReport).mockRejectedValue(new Error('down'));
    const { result } = setup(SESSION);

    openWithDraft(result);
    await act(() => result.current.onSubmit());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(TEXT.failed));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.form.getValues('reason')).toBe('cheating');
  });

  it('discards the draft when the dialog is closed', () => {
    const { result } = setup(SESSION);

    openWithDraft(result);
    expect(result.current.detailsLength).toBe('  aimbot  '.length);

    act(() => result.current.onOpenChange(false));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.form.getValues()).toEqual(REPORT_FORM_DEFAULT_VALUES);
    expect(result.current.detailsLength).toBe(0);
  });
});
