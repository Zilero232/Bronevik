import type { MoeHistory, MoeHistoryBatch, MoePage, MoeProjection } from '@bronevik/schemas';

import type { MoeHistoryBatchInput, MoeHistoryInput, MoeListInput, MoeProjectionInput } from './marks.types';

import { marksControllerHistory, marksControllerHistoryBatch, marksControllerList, marksControllerProject } from '../generated';
import { listParam } from '../http';
import { fromSdk } from '../source';
import { MOE_REQUEST } from './marks.constants';

export const listMoe = ({ signal, tiers, types, nations, ...rest }: MoeListInput): Promise<MoePage> =>
  fromSdk(() =>
    marksControllerList({
      query: { limit: MOE_REQUEST.pageLimit, ...rest, tiers: listParam(tiers), types: listParam(types), nations: listParam(nations) },
      signal
    })
  );

export const getMoeHistory = ({ signal, tankId, ...query }: MoeHistoryInput): Promise<MoeHistory> =>
  fromSdk(() => marksControllerHistory({ path: { tankId }, query, signal }));

export const getMoeHistoryBatch = ({ signal, tankIds, days = MOE_REQUEST.sparkDays, source }: MoeHistoryBatchInput): Promise<MoeHistoryBatch> =>
  fromSdk(() => marksControllerHistoryBatch({ query: { tankIds: [...tankIds], days, source }, signal }));

export const projectMoe = ({ signal, ...body }: MoeProjectionInput): Promise<MoeProjection> =>
  fromSdk(() => marksControllerProject({ body, signal }));
