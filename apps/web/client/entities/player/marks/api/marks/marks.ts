import type { MoeHistory, MoePage } from '@otmetki/schemas';

import { marksControllerHistory, marksControllerList } from '@/shared/api/generated';
import { listParam } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { MoeHistoryInput, MoeListInput } from './marks.types';

import { MOE_REQUEST } from './marks.constants';

export const listMoe = ({ signal, tiers, types, nations, statuses, roles, ...rest }: MoeListInput): Promise<MoePage> =>
  fromSdk(() =>
    marksControllerList({
      query: {
        limit: MOE_REQUEST.pageLimit,
        ...rest,
        tiers: listParam(tiers),
        types: listParam(types),
        nations: listParam(nations),
        statuses: listParam(statuses),
        roles: listParam(roles)
      },
      signal
    })
  );

export const getMoeHistory = ({ signal, tankId, ...query }: MoeHistoryInput): Promise<MoeHistory> =>
  fromSdk(() => marksControllerHistory({ path: { tankId }, query, signal }));
