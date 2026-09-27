import type { LestaClientOptions } from './client.types';

import {
  createAccountMethods,
  createAuthMethods,
  createClanratingsMethods,
  createClansMethods,
  createEncyclopediaMethods,
  createGlobalmapMethods,
  createRatingsMethods,
  createStrongholdMethods,
  createTanksMethods,
  createWgnMethods
} from '../methods';
import { createRequester } from './requester';

export const createLestaClient = (options: LestaClientOptions) => {
  const requester = createRequester(options);

  return {
    request: requester.call,
    account: createAccountMethods(requester),
    auth: createAuthMethods(requester),
    tanks: createTanksMethods(requester),
    encyclopedia: createEncyclopediaMethods(requester),
    clans: createClansMethods(requester),
    globalmap: createGlobalmapMethods(requester),
    stronghold: createStrongholdMethods(requester),
    ratings: createRatingsMethods(requester),
    clanratings: createClanratingsMethods(requester),
    wgn: createWgnMethods(requester)
  };
};

export type LestaClient = ReturnType<typeof createLestaClient>;
