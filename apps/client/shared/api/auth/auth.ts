import { z } from 'zod';

import { env } from '@/shared/config/client-env';
import { isBrowser } from '@/shared/lib';
import { MOCK_PLAYERS } from '@/shared/mocks';

import type { AuthSession, LestaStartInput, MagicLinkInput, TelegramWidgetConfig } from './auth.types';

import { api, bearerToken } from '../http';
import { fromSource } from '../source';
import { AUTH_PATHS, MOCK_AUTH } from './auth.constants';

const WITH_SESSION = { withCredentials: true } as const;

const sessionSchema = z
  .object({
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().nullish(),
      image: z.string().nullish()
    })
  })
  .nullable();

const widgetSchema = z.object({ botUsername: z.string().nullable(), enabled: z.boolean() });

const isMockSignedIn = () => !isBrowser() || window.localStorage.getItem(MOCK_AUTH.storageKey) !== MOCK_AUTH.signedOut;

const setMockSignedIn = (signedIn: boolean) => {
  if (isBrowser()) {
    window.localStorage.setItem(MOCK_AUTH.storageKey, signedIn ? MOCK_AUTH.signedIn : MOCK_AUTH.signedOut);
  }
};

const mockSession = (): AuthSession =>
  isMockSignedIn() ? { user: { id: 'mock-user', name: MOCK_PLAYERS[0].nickname, email: null, image: null } } : null;

export const getAuthSession = (): Promise<AuthSession> =>
  fromSource({ mock: mockSession, fetch: async () => sessionSchema.parse((await api.get(AUTH_PATHS.session, WITH_SESSION)).data) });

export const lestaStartUrl = ({ callbackURL }: LestaStartInput) => {
  const url = new URL(AUTH_PATHS.lestaStart, env.NEXT_PUBLIC_API_URL);

  url.searchParams.set('callbackURL', callbackURL);

  return url.toString();
};

export const getTelegramWidget = (): Promise<TelegramWidgetConfig> =>
  fromSource({
    mock: () => ({ botUsername: null, enabled: false }),
    fetch: async () => widgetSchema.parse((await api.get(AUTH_PATHS.telegramWidget, WITH_SESSION)).data)
  });

export const signInWithTelegram = (payload: Record<string, number | string>): Promise<void> =>
  fromSource({
    mock: () => setMockSignedIn(true),
    fetch: async () => {
      await api.post(AUTH_PATHS.telegramCallback, payload, WITH_SESSION);
    }
  });

export const sendMagicLink = ({ email, callbackURL }: MagicLinkInput): Promise<void> =>
  fromSource({
    mock: () => setMockSignedIn(true),
    fetch: async () => {
      await api.post(AUTH_PATHS.magicLink, { email, callbackURL }, WITH_SESSION);
    }
  });

export const signOut = (): Promise<void> =>
  fromSource({
    mock: () => setMockSignedIn(false),
    fetch: async () => {
      await api.post(AUTH_PATHS.signOut, {}, WITH_SESSION);
      bearerToken.clear();
    }
  });
