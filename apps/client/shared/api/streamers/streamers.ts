import type { CreateChallengeInput, Overlay } from '@otmetki/schemas';

import { createOverlaySchema, previewOverlaySchema, updateOverlaySchema } from '@otmetki/schemas';

import type {
  ActivateChallengeInput,
  ConnectableProvider,
  CreateOverlayInput,
  OverlayData,
  PreviewOverlayInput,
  StreamerChallenge,
  StreamerIntegration,
  StreamerProfile,
  UpdateOverlayInput,
  UpsertStreamerProfileInput
} from './streamers.types';

import {
  overlaysControllerShow,
  streamersControllerActivateChallenge,
  streamersControllerBySlug,
  streamersControllerCancelChallenge,
  streamersControllerConnect,
  streamersControllerCreateChallenge,
  streamersControllerCreateOverlay,
  streamersControllerDisconnect,
  streamersControllerListChallenges,
  streamersControllerListIntegrations,
  streamersControllerListOverlays,
  streamersControllerPreviewOverlay,
  streamersControllerProfile,
  streamersControllerRemoveOverlay,
  streamersControllerSaveProfile,
  streamersControllerUpdateOverlay
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
