import { magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { env } from '@/shared/config/client-env';

import { bearerToken } from '../../http';
import { AUTH_CLIENT } from '../auth.constants';
import { telegramLoginClient } from '../telegram-login-client';

export const authClient = createAuthClient({
  baseURL: new URL(AUTH_CLIENT.basePath, env.NEXT_PUBLIC_API_URL).toString(),
  fetchOptions: {
    credentials: 'include',
    auth: { type: 'Bearer', token: () => bearerToken.get() ?? undefined }
  },
  plugins: [magicLinkClient(), telegramLoginClient()]
});
