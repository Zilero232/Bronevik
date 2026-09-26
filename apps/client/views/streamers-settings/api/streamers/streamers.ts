import type { SettingsAggregates, SettingsCohort, SettingsShare } from '@otmetki/schemas';

import {
  streamersControllerRemoveSettingsShare,
  streamersControllerSettingsAggregates,
  streamersControllerUpdateSettingsShare
} from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getSettingsAggregates = (cohort: SettingsCohort): Promise<SettingsAggregates> =>
  fromSdk(() => streamersControllerSettingsAggregates({ query: { cohort } }));

export const updateSettingsShare = (anonymousStats: boolean): Promise<SettingsShare> =>
  fromSdk(() => streamersControllerUpdateSettingsShare({ ...SESSION_REQUEST, body: { anonymousStats } }));

export const removeSettingsShare = async (): Promise<void> => {
  await fromSdk(() => streamersControllerRemoveSettingsShare(SESSION_REQUEST));
};
