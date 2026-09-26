import type { LestaStartInput } from './auth.types';

import { AUTH_CLIENT } from '@/shared/api/auth';
import { env } from '@/shared/config/client-env';

export const lestaStartUrl = ({ callbackURL }: LestaStartInput) => {
  const url = new URL(AUTH_CLIENT.lestaStartPath, env.NEXT_PUBLIC_API_URL);

  url.searchParams.set('callbackURL', callbackURL);

  return url.toString();
};
