import type { MockRoute } from './responses.types';

import { serversOnline } from '../online';
import { mockAccessToken } from '../token';
import { fail, intParam, ok } from './envelope';
import { RESPONSES } from './responses.constants';

export const wgnServersInfo: MockRoute = (context) => {
  const game = context.params.game ?? 'wot';

  return ok({ [game === 'wot' ? 'wot' : game]: game === 'wot' ? serversOnline(context.world.seed, context.now) : [] });
};

export const authLogin: MockRoute = (context) => {
  const query = new URLSearchParams(
    Object.entries(context.params).filter(([key]) => ['application_id', 'display', 'expires_at', 'redirect_uri'].includes(key))
  );

  return ok({ location: `${context.loginUrl}?${query.toString()}` });
};

export const authProlongate: MockRoute = (context) => {
  if (context.tokenAccountId === null) {
    return fail({ code: 407, message: 'INVALID_ACCESS_TOKEN', field: 'access_token', value: context.params.access_token ?? null });
  }

  return ok({
    access_token: mockAccessToken(context.world.seed, context.tokenAccountId),
    account_id: context.tokenAccountId,
    expires_at: intParam(context.params, 'expires_at', context.now + RESPONSES.tokenTtlSec)
  });
};

export const authLogout: MockRoute = (context) =>
  context.tokenAccountId === null
    ? fail({ code: 407, message: 'INVALID_ACCESS_TOKEN', field: 'access_token', value: context.params.access_token ?? null })
    : ok(null);
