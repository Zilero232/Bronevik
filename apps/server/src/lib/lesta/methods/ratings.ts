import type { LestaRequester } from '../client/client.types';
import type { RatingAccountsInput } from './methods.types';

import { looseMapSchema } from '../schemas';
import { batchedMap, genericParams, passthrough } from './methods.helpers';

export const createRatingsMethods = (requester: LestaRequester) => {
  const accounts = async ({ type, accountIds, date, ...input }: RatingAccountsInput): Promise<Record<string, unknown>> =>
    batchedMap({
      requester,
      method: 'ratings/accounts',
      idParam: 'account_id',
      ids: accountIds,
      params: { ...genericParams(input), type, date },
      schema: looseMapSchema
    });

  return {
    types: passthrough({ requester, method: 'ratings/types' }),
    dates: passthrough({ requester, method: 'ratings/dates' }),
    accounts,
    neighbors: passthrough({ requester, method: 'ratings/neighbors' }),
    top: passthrough({ requester, method: 'ratings/top' })
  };
};
