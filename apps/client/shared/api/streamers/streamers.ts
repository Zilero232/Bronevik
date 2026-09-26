import type {
  ApplyRequest,
  CreateApplyRequestInput,
  CreateChallengeInput,
  Overlay,
  SaveStreamerSettingsInput,
  SettingsAggregates,
  SettingsCohort,
  SettingsHistoryEntry,
  SettingsShare,
  SettingsTableRow,
  StreamerCard,
  StreamerClaim,
  StreamerDirectory,
  StreamerFollow,
  StreamerSettingsView
} from '@otmetki/schemas';

import {
  createApplyRequestSchema,
  createOverlaySchema,
  previewOverlaySchema,
  saveStreamerSettingsSchema,
  updateOverlaySchema
} from '@otmetki/schemas';

import type {
  ActivateChallengeInput,
  ConnectableProvider,
  CreateOverlayInput,
  FollowStreamerRequest,
  StreamerDirectoryFilters,
  OverlayData,
  PreviewOverlayInput,
  RemovalRequest,
  StartClaimRequest,
  StreamerChallenge,
  StreamerIntegration,
  StreamerProfile,
  UpdateOverlayInput,
  UpsertStreamerProfileInput
} from './streamers.types';

import {
  overlaysControllerShow,
  streamersControllerActivateChallenge,
  streamersControllerApplyRequests,
  streamersControllerBySlug,
  streamersControllerCancelChallenge,
  streamersControllerClaim,
  streamersControllerClaimStatus,
  streamersControllerCompareSettings,
  streamersControllerConnect,
  streamersControllerCreateChallenge,
  streamersControllerCreateOverlay,
  streamersControllerDisconnect,
  streamersControllerFollow,
  streamersControllerList,
  streamersControllerListChallenges,
  streamersControllerListIntegrations,
  streamersControllerListOverlays,
  streamersControllerLive,
  streamersControllerMyFollows,
  streamersControllerMySettings,
  streamersControllerPreviewOverlay,
  streamersControllerProfile,
  streamersControllerRemovalRequest,
  streamersControllerRemoveOverlay,
  streamersControllerRemoveSettingsShare,
  streamersControllerRequestApply,
  streamersControllerSaveProfile,
  streamersControllerSaveSettings,
  streamersControllerSettingsAggregates,
  streamersControllerSettingsBySlug,
  streamersControllerSettingsHistory,
  streamersControllerSettingsShare,
  streamersControllerSettingsTable,
  streamersControllerUnfollow,
  streamersControllerUpdateOverlay,
  streamersControllerUpdateSettingsShare,
  streamersControllerVerifyClaim
} from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const getMyStreamerProfile = (): Promise<StreamerProfile> => fromSdk(() => streamersControllerProfile(SESSION_REQUEST));

export const saveStreamerProfile = (input: UpsertStreamerProfileInput): Promise<StreamerProfile> =>
  fromSdk(() => streamersControllerSaveProfile({ ...SESSION_REQUEST, body: input }));

export const getStreamerBySlug = (slug: string): Promise<StreamerProfile> => fromSdk(() => streamersControllerBySlug({ path: { slug } }));

export const getOverlays = (): Promise<Overlay[]> => fromSdk(() => streamersControllerListOverlays(SESSION_REQUEST));

export const createOverlay = (input: CreateOverlayInput): Promise<Overlay> =>
  fromSdk(() => streamersControllerCreateOverlay({ ...SESSION_REQUEST, body: createOverlaySchema.parse(input) }));

export const updateOverlay = ({ id, ...patch }: UpdateOverlayInput): Promise<Overlay> =>
  fromSdk(() => streamersControllerUpdateOverlay({ ...SESSION_REQUEST, path: { id }, body: updateOverlaySchema.parse(patch) }));

export const removeOverlay = async (id: string): Promise<void> => {
  await fromSdk(() => streamersControllerRemoveOverlay({ ...SESSION_REQUEST, path: { id } }));
};

export const getChallenges = (): Promise<StreamerChallenge[]> => fromSdk(() => streamersControllerListChallenges(SESSION_REQUEST));

export const createChallenge = (input: CreateChallengeInput): Promise<StreamerChallenge> =>
  fromSdk(() => streamersControllerCreateChallenge({ ...SESSION_REQUEST, body: input }));

export const activateChallenge = ({ id, donorName }: ActivateChallengeInput): Promise<StreamerChallenge> =>
  fromSdk(() => streamersControllerActivateChallenge({ ...SESSION_REQUEST, path: { id }, body: { donorName } }));

export const cancelChallenge = (id: string): Promise<StreamerChallenge> =>
  fromSdk(() => streamersControllerCancelChallenge({ ...SESSION_REQUEST, path: { id } }));

export const getIntegrations = (): Promise<StreamerIntegration[]> => fromSdk(() => streamersControllerListIntegrations(SESSION_REQUEST));

export const connectIntegration = async (provider: ConnectableProvider): Promise<string> =>
  (await fromSdk(() => streamersControllerConnect({ ...SESSION_REQUEST, path: { provider } }))).url;

export const disconnectIntegration = async (provider: ConnectableProvider): Promise<void> => {
  await fromSdk(() => streamersControllerDisconnect({ ...SESSION_REQUEST, path: { provider } }));
};

export const getOverlayData = (publicId: string): Promise<OverlayData> => fromSdk(() => overlaysControllerShow({ path: { publicId } }));

export const previewOverlay = (input: PreviewOverlayInput): Promise<OverlayData> =>
  fromSdk(() => streamersControllerPreviewOverlay({ ...SESSION_REQUEST, body: previewOverlaySchema.parse(input) }));

export const getStreamerDirectory = (query: StreamerDirectoryFilters): Promise<StreamerDirectory> => fromSdk(() => streamersControllerList({ query }));

export const getLiveStreamers = (): Promise<StreamerCard[]> => fromSdk(() => streamersControllerLive());

export const getStreamerSettings = (slug: string): Promise<StreamerSettingsView> =>
  fromSdk(() => streamersControllerSettingsBySlug({ path: { slug } }));

export const getStreamerSettingsHistory = (slug: string): Promise<SettingsHistoryEntry[]> =>
  fromSdk(() => streamersControllerSettingsHistory({ path: { slug } }));

export const getSettingsTable = (): Promise<SettingsTableRow[]> => fromSdk(() => streamersControllerSettingsTable());

export const compareStreamerSettings = (slugs: readonly string[]): Promise<StreamerSettingsView[]> =>
  fromSdk(() => streamersControllerCompareSettings({ query: { slugs: slugs.join(',') } }));

export const getSettingsAggregates = (cohort: SettingsCohort): Promise<SettingsAggregates> =>
  fromSdk(() => streamersControllerSettingsAggregates({ query: { cohort } }));

export const getMyStreamerSettings = (): Promise<StreamerSettingsView> => fromSdk(() => streamersControllerMySettings(SESSION_REQUEST));

export const saveMyStreamerSettings = (input: SaveStreamerSettingsInput): Promise<StreamerSettingsView> =>
  fromSdk(() => streamersControllerSaveSettings({ ...SESSION_REQUEST, body: saveStreamerSettingsSchema.parse(input) }));

export const getApplyRequests = (): Promise<ApplyRequest[]> => fromSdk(() => streamersControllerApplyRequests(SESSION_REQUEST));

export const requestSettingsApply = (input: CreateApplyRequestInput): Promise<ApplyRequest> =>
  fromSdk(() => streamersControllerRequestApply({ ...SESSION_REQUEST, body: createApplyRequestSchema.parse(input) }));

export const getSettingsShare = async (): Promise<SettingsShare | null> =>
  (await fromSdk(() => streamersControllerSettingsShare(SESSION_REQUEST))).share;

export const updateSettingsShare = (anonymousStats: boolean): Promise<SettingsShare> =>
  fromSdk(() => streamersControllerUpdateSettingsShare({ ...SESSION_REQUEST, body: { anonymousStats } }));

export const removeSettingsShare = async (): Promise<void> => {
  await fromSdk(() => streamersControllerRemoveSettingsShare(SESSION_REQUEST));
};

export const getMyFollows = (): Promise<StreamerFollow[]> => fromSdk(() => streamersControllerMyFollows(SESSION_REQUEST));

export const followStreamer = ({ slug, tankId }: FollowStreamerRequest): Promise<StreamerFollow[]> =>
  fromSdk(() => streamersControllerFollow({ ...SESSION_REQUEST, path: { slug }, body: { tankId: tankId ?? null } }));

export const unfollowStreamer = async (slug: string): Promise<void> => {
  await fromSdk(() => streamersControllerUnfollow({ ...SESSION_REQUEST, path: { slug } }));
};

export const getClaimStatus = async (slug: string): Promise<StreamerClaim | null> =>
  (await fromSdk(() => streamersControllerClaimStatus({ ...SESSION_REQUEST, path: { slug } }))).claim;

export const startClaim = ({ slug, ...body }: StartClaimRequest): Promise<StreamerClaim> =>
  fromSdk(() => streamersControllerClaim({ ...SESSION_REQUEST, path: { slug }, body }));

export const verifyClaim = (slug: string): Promise<StreamerClaim> =>
  fromSdk(() => streamersControllerVerifyClaim({ ...SESSION_REQUEST, path: { slug } }));

export const requestStreamerRemoval = async ({ slug, ...body }: RemovalRequest): Promise<void> => {
  await fromSdk(() => streamersControllerRemovalRequest({ path: { slug }, body }));
};
