import type { ModeMeta, ModesHub, MyModeStats } from '@otmetki/schemas';

import { modesControllerHub, modesControllerModeMeta, modesControllerMyStats } from '@/shared/api/generated';
import { listParam, SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { ModeMetaInput, MyModeStatsInput, SignalInput } from './modes.types';

export const getModesHub = ({ signal }: SignalInput): Promise<ModesHub> => fromSdk(() => modesControllerHub({ signal }));

export const getModeMeta = ({
  mode,
  tiers,
  types,
  nations,
  statuses,
  roles,
  premium,
  collectible,
  minBattles,
  signal
}: ModeMetaInput): Promise<ModeMeta> =>
  fromSdk(() =>
    modesControllerModeMeta({
      path: { mode },
      query: {
        tiers: listParam(tiers),
        types: listParam(types),
        nations: listParam(nations),
        statuses: listParam(statuses),
        roles: listParam(roles),
        premium,
        collectible,
        minBattles
      },
      signal
    })
  );

export const getMyModeStats = ({ days, signal }: MyModeStatsInput): Promise<MyModeStats> =>
  fromSdk(() => modesControllerMyStats({ ...SESSION_REQUEST, query: { days }, signal }));
