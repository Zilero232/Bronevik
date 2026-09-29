import { AUTH_CLIENT } from '@/shared/api/auth';
import { env } from '@/shared/config';

import type { LestaStartInput } from './auth.types';

export const lestaStartUrl = ({ callbackURL, errorCallbackURL }: LestaStartInput) => {
  const url = new URL(AUTH_CLIENT.lestaStartPath, env.NEXT_PUBLIC_API_URL);

  url.searchParams.set('callbackURL', callbackURL);

  if (errorCallbackURL) {
    url.searchParams.set('errorCallbackURL', errorCallbackURL);
  }

  return url.toString();
};
