import type { ApplyRequest, SettingsShare, SettingsTableRow, StreamerCard } from '@otmetki/schemas';

import {
  streamersControllerApplyRequests,
  streamersControllerBySlug,
  streamersControllerListIntegrations,
  streamersControllerLive,
  streamersControllerSettingsShare,
  streamersControllerSettingsTable
} from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { StreamerIntegration, StreamerProfile } from './streamers.types';

export const getStreamerBySlug = (slug: string): Promise<StreamerProfile> => fromSdk(() => streamersControllerBySlug({ path: { slug } }));

export const getIntegrations = (): Promise<StreamerIntegration[]> => fromSdk(() => streamersControllerListIntegrations(SESSION_REQUEST));

export const getLiveStreamers = (): Promise<StreamerCard[]> => fromSdk(() => streamersControllerLive());

export const getSettingsTable = (): Promise<SettingsTableRow[]> => fromSdk(() => streamersControllerSettingsTable());

export const getApplyRequests = (): Promise<ApplyRequest[]> => fromSdk(() => streamersControllerApplyRequests(SESSION_REQUEST));

export const getSettingsShare = async (): Promise<SettingsShare | null> =>
  (await fromSdk(() => streamersControllerSettingsShare(SESSION_REQUEST))).share;
