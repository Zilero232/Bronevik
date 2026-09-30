import type { PlayerProfile } from '@otmetki/schemas';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useOwnPlayer } from '@/entities/player/own-player';
import { getPlayer } from '@/entities/player/profile/api/players/players';
import { NicknameForm } from '@/features/player/own-nickname';
import { NotFoundError } from '@/shared/api/source';
import { messages } from '@/shared/i18n';

vi.mock('@/entities/player/profile/api/players/players', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/player/profile/api/players/players')>()),
  getPlayer: vi.fn()
}));

const TEXT = messages.en.ownPlayer.form;

const RATING = { value: null, tier: null };

const PROFILE: PlayerProfile = {
  summary: {
    accountId: 42,
    nickname: 'Berkut83',
    clan: null,
    createdAt: null,
    lastBattleAt: null,
    updatedAt: '2026-09-25T00:00:00.000Z',
    isTracked: true,
    overall: {
      battles: 1,
      winRate: null,
      avgDamage: null,
      avgFrags: null,
      avgSpotted: null,
      avgXp: null,
      avgBlocked: null,
      avgAssisted: null,
      survivalRate: null,
      accuracy: null,
      avgTier: null,
      wn8: RATING,
      eff: RATING,
      broneIndex: RATING
    },
    marks: { moe3: 0, moe2: 0, moe1: 0, mastery: 0, tanksOwned: 0 }
  },
  recent: []
};

const Stored = () => {
  const { player } = useOwnPlayer();

  return <output>{player ? `${player.accountId}:${player.nickname}` : 'none'}</output>;
};

const renderForm = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        <NicknameForm />
        <Stored />
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

const submit = (nickname: string) => {
  fireEvent.change(screen.getByPlaceholderText(TEXT.placeholder), { target: { value: nickname } });
  fireEvent.click(screen.getByRole('button', { name: TEXT.submit }));
};

afterEach(() => {
  window.localStorage.clear();
  vi.mocked(getPlayer).mockReset();
});

describe('NicknameForm', () => {
  it('remembers the account the API resolves, with its canonical nickname', async () => {
    vi.mocked(getPlayer).mockResolvedValue(PROFILE);
    renderForm();
    submit('berkut83');

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('42:Berkut83'));
  });

  it('says the player does not exist on a 404 and stores nothing', async () => {
    vi.mocked(getPlayer).mockRejectedValue(new NotFoundError());
    renderForm();
    submit('nobody_here');

    expect(await screen.findByText(TEXT.errors.notFound)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('none');
  });

  it('rejects a nickname with characters a nickname cannot have without calling the API', async () => {
    renderForm();
    submit('bad nick');

    expect(await screen.findByText(TEXT.errors.invalid)).toBeInTheDocument();
    expect(getPlayer).not.toHaveBeenCalled();
  });
});
