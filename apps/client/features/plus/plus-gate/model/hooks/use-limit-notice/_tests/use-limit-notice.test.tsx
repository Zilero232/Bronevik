import type { BillingStatus, PlusCountKey } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { PLUS_LIMITS } from '@otmetki/schemas';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterAll, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { getBillingStatus } from '@/entities/plus/subscription/api/billing/billing';
import { QUERY_KEYS } from '@/shared/constants';

import { useLimitNotice } from '../use-limit-notice';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('@/entities/plus/subscription/api/billing/billing', () => ({
  getBillingStatus: vi.fn(),
  getPaymentHistory: vi.fn(),
  getPlusPlans: vi.fn(),
  startPlusTrial: vi.fn()
}));

const SESSION: AuthSession = {
  user: { id: 'user-1', name: 'Tanker', email: 'user-1@example.com', emailVerified: false, createdAt: new Date(0), updatedAt: new Date(0) },
  lestaAccountId: 1001
};

const KEY: PlusCountKey = 'goals';
const FREE = PLUS_LIMITS[KEY].free;
const PLUS = PLUS_LIMITS[KEY].plus;

const FREE_STATUS: BillingStatus = {
  isPlus: false,
  plan: null,
  status: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  card: null,
  isRecurringAvailable: true,
  isCheckoutAvailable: true,
  plus: { state: 'none', periodEnd: null, graceEndsAt: null, trialAvailable: true, trialDays: 7 },
  plans: []
};

const ACTIVE_STATUS: BillingStatus = { ...FREE_STATUS, isPlus: true, status: 'active', plus: { ...FREE_STATUS.plus, state: 'active' } };

const renderNotice = async ({ session, status, used }: { session: AuthSession; status: BillingStatus; used: number }) => {
  vi.mocked(getBillingStatus).mockResolvedValue(status);

  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  client.setQueryData(QUERY_KEYS.auth.session, session);

  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  const view = renderHook(() => useLimitNotice({ limitKey: KEY, used }), { wrapper });

  if (session) {
    await waitFor(() => expect(client.getQueryData(QUERY_KEYS.me.billing.status)).toEqual(status));
  }

  return view;
};

describe('useLimitNotice', () => {
  it('stays hidden below the free limit', async () => {
    const { result } = await renderNotice({ session: SESSION, status: FREE_STATUS, used: FREE - 1 });

    expect(result.current.isVisible).toBe(false);
  });

  it('shows once usage reaches the free limit and names the Plus limit', async () => {
    const { result } = await renderNotice({ session: SESSION, status: FREE_STATUS, used: FREE });

    expect(result.current).toEqual({ isVisible: true, isPlus: false, limit: FREE, plusLimit: PLUS });
  });

  it('measures a Plus member against the Plus limit', async () => {
    const below = await renderNotice({ session: SESSION, status: ACTIVE_STATUS, used: FREE });
    const at = await renderNotice({ session: SESSION, status: ACTIVE_STATUS, used: PLUS });

    expect(below.result.current).toMatchObject({ isVisible: false, isPlus: true, limit: PLUS });
    expect(at.result.current.isVisible).toBe(true);
  });

  it('never shows for a guest', async () => {
    const { result } = await renderNotice({ session: null, status: FREE_STATUS, used: FREE + 1 });

    expect(result.current.isVisible).toBe(false);
  });
});
