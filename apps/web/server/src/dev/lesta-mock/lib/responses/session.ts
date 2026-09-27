import type { MockRoute } from './responses.types';

import { serversOnline } from '../online';
import { mockAccessToken } from '../token';
import { fail, intParam, ok } from './envelope';
import { RESPONSES } from './responses.constants';

export const wgnServersInfo: MockRoute = (context) => {
  const game = context.params.game ?? 'wot';

  return ok({ data: { [game === 'wot' ? 'wot' : game]: game === 'wot' ? serversOnline({ seed: context.world.seed, at: context.now }) : [] } });
};

export const authLogin: MockRoute = (context) => {
  const query = new URLSearchParams(
    Object.entries(context.params).filter(([key]) => ['application_id', 'display', 'expires_at', 'redirect_uri'].includes(key))
  );

  return ok({ data: { location: `${context.loginUrl}?${query.toString()}` } });
};

export const authProlongate: MockRoute = (context) => {
  if (context.tokenAccountId === null) {
    return fail({ code: 407, message: 'INVALID_ACCESS_TOKEN', field: 'access_token', value: context.params.access_token ?? null });
  }

  return ok({
    data: {
      access_token: mockAccessToken({ seed: context.world.seed, accountId: context.tokenAccountId }),
      account_id: context.tokenAccountId,
      expires_at: intParam({ params: context.params, key: 'expires_at', fallback: context.now + RESPONSES.tokenTtlSec })
    }
  });
};

export const authLogout: MockRoute = (context) =>
  context.tokenAccountId === null
    ? fail({ code: 407, message: 'INVALID_ACCESS_TOKEN', field: 'access_token', value: context.params.access_token ?? null })
    : ok({ data: null });
