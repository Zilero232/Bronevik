import type { LestaMockCall, LestaMockEnvelope, LestaMockHandler, MockWorld } from '../../lesta-mock.types';
import type { MockRoute } from './responses.types';

import { LESTA_MOCK } from '../../../../config';
import { parseFields } from '../fields';
import { accountOfToken } from '../token';
import { accountAchievementsRoute, accountInfoRoute, accountList, accountTanks } from './account';
import {
  clansAccountInfo,
  clansGlossary,
  clansInfo,
  clansList,
  clansMemberHistory,
  globalmapClanInfo,
  globalmapClanProvinces,
  strongholdClanInfo,
  strongholdClanReserves
} from './clans';
import {
  encyclopediaAchievements,
  encyclopediaArenas,
  encyclopediaCrewRoles,
  encyclopediaCrewSkills,
  encyclopediaInfo,
  encyclopediaModules,
  encyclopediaProvisions,
  encyclopediaVehicles
} from './encyclopedia';
import { fail } from './envelope';
import { ratingsAccounts, ratingsDates, ratingsNeighbors, ratingsTop, ratingsTypes } from './ratings';
import { authLogin, authLogout, authProlongate, wgnServersInfo } from './session';
import { tanksAchievements, tanksMastery, tanksStats } from './tanks';

export const MOCK_ROUTES: Readonly<Record<string, MockRoute>> = {
  'wot/account/list': accountList,
  'wot/account/info': accountInfoRoute,
  'wot/account/tanks': accountTanks,
  'wot/account/achievements': accountAchievementsRoute,
  'wot/tanks/stats': tanksStats,
  'wot/tanks/achievements': tanksAchievements,
  'wot/tanks/mastery': tanksMastery,
  'wot/clans/list': clansList,
  'wot/clans/info': clansInfo,
  'wot/clans/accountinfo': clansAccountInfo,
  'wot/clans/memberhistory': clansMemberHistory,
  'wot/clans/glossary': clansGlossary,
  'wot/globalmap/claninfo': globalmapClanInfo,
  'wot/globalmap/clanprovinces': globalmapClanProvinces,
  'wot/stronghold/claninfo': strongholdClanInfo,
  'wot/stronghold/clanreserves': strongholdClanReserves,
  'wot/ratings/types': ratingsTypes,
  'wot/ratings/dates': ratingsDates,
  'wot/ratings/top': ratingsTop,
  'wot/ratings/accounts': ratingsAccounts,
  'wot/ratings/neighbors': ratingsNeighbors,
  'wot/encyclopedia/info': encyclopediaInfo,
  'wot/encyclopedia/vehicles': encyclopediaVehicles,
  'wot/encyclopedia/modules': encyclopediaModules,
  'wot/encyclopedia/provisions': encyclopediaProvisions,
  'wot/encyclopedia/achievements': encyclopediaAchievements,
  'wot/encyclopedia/arenas': encyclopediaArenas,
  'wot/encyclopedia/crewskills': encyclopediaCrewSkills,
  'wot/encyclopedia/crewroles': encyclopediaCrewRoles,
  'wot/auth/login': authLogin,
  'wot/auth/prolongate': authProlongate,
  'wot/auth/logout': authLogout,
  'wgn/servers/info': wgnServersInfo
};

export const normalizeMethod = (method: string): string => method.replaceAll(/^\/+|\/+$/g, '');

export const createLestaMockHandler =
  (world: MockWorld): LestaMockHandler =>
  ({ method, params, now, loginUrl }: LestaMockCall): LestaMockEnvelope => {
    const key = normalizeMethod(method);
    const route = MOCK_ROUTES[key];

    if (params.application_id !== LESTA_MOCK.applicationId) {
      return fail({ code: 407, message: 'INVALID_APPLICATION_ID', field: 'application_id', value: params.application_id ?? null });
    }

    if (!route) {
      return fail({ code: 404, message: 'METHOD_NOT_FOUND', field: null, value: key });
    }

    return route({
      world,
      method: key,
      params,
      now,
      fields: parseFields(params.fields),
      extra: parseFields(params.extra),
      tokenAccountId: accountOfToken({ seed: world.seed, token: params.access_token }),
      hasToken: Boolean(params.access_token),
      loginUrl
    });
  };
