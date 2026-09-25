import type { MoeHistory, MoeHistoryBatch, MoePage, MoeProjection } from '@bronevik/schemas';

import { moeHistoryBatchSchema, moeHistorySchema, moePageSchema, moeProjectionSchema } from '@bronevik/schemas';

import type { MoeHistoryBatchInput, MoeHistoryInput, MoeListInput, MoeProjectionInput } from './marks.types';

import { api, joinList } from '../http';
import { fromSource } from '../source';
import { MOE_REQUEST } from './marks.constants';
import { mockMoeHistory, mockMoeHistoryBatch, mockMoeList, mockMoeProjection } from './marks.mock';

export const listMoe = ({ signal, ...input }: MoeListInput): Promise<MoePage> =>
  fromSource({
    signal,
    mock: () => mockMoeList({ limit: MOE_REQUEST.pageLimit, ...input }),
    fetch: async () => {
      const { tiers, types, nations, ...rest } = input;
      const params = { limit: MOE_REQUEST.pageLimit, ...rest, tiers: joinList(tiers), types: joinList(types), nations: joinList(nations) };
      const { data } = await api.get('/marks', { params, signal });

      return moePageSchema.parse(data);
    }
  });

export const getMoeHistory = ({ signal, tankId, ...params }: MoeHistoryInput): Promise<MoeHistory> =>
  fromSource({
    signal,
    mock: () => mockMoeHistory({ tankId }),
    fetch: async () => {
      const { data } = await api.get(`/marks/${tankId}/history`, { params, signal });

      return moeHistorySchema.parse(data);
    }
  });

export const getMoeHistoryBatch = ({ signal, tankIds, days = MOE_REQUEST.sparkDays, source }: MoeHistoryBatchInput): Promise<MoeHistoryBatch> =>
  fromSource({
    signal,
    mock: () => mockMoeHistoryBatch({ tankIds, days }),
    fetch: async () => {
      const { data } = await api.get('/marks/history', { params: { tankIds: joinList(tankIds), days, source }, signal });

      return moeHistoryBatchSchema.parse(data);
    }
  });

export const projectMoe = ({ signal, ...input }: MoeProjectionInput): Promise<MoeProjection> =>
  fromSource({
    signal,
    mock: () => mockMoeProjection(input),
    fetch: async () => {
      const { data } = await api.post('/marks/projection', input, { signal });

      return moeProjectionSchema.parse(data);
    }
  });
