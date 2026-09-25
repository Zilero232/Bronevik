import type { CreateChallengeInput, Overlay } from '@bronevik/schemas';

import { overlaySchema } from '@bronevik/schemas';

import type {
  ActivateChallengeInput,
  ConnectableProvider,
  CreateOverlayInput,
  OverlayData,
  StreamerChallenge,
  StreamerIntegration,
  StreamerProfile,
  UpdateOverlayInput,
  UpsertStreamerProfileInput
} from './streamers.types';

import { api } from '../http';
import { fromSource } from '../source';
import { mockStreamers } from './mock/streamers.mock';
import { STREAMERS_PATHS } from './streamers.constants';
import {
  challengeListSchema,
  connectUrlSchema,
  integrationListSchema,
  overlayDataSchema,
  overlayListSchema,
  streamerChallengeSchema,
  streamerProfileSchema
} from './streamers.schemas';

const WITH_SESSION = { withCredentials: true } as const;

export const getMyStreamerProfile = (): Promise<StreamerProfile> =>
  fromSource({
    mock: () => streamerProfileSchema.parse(mockStreamers.profile()),
    fetch: async () => streamerProfileSchema.parse((await api.get(STREAMERS_PATHS.profile, WITH_SESSION)).data)
  });

export const saveStreamerProfile = (input: UpsertStreamerProfileInput): Promise<StreamerProfile> =>
  fromSource({
    mock: () => streamerProfileSchema.parse(mockStreamers.saveProfile(input)),
    fetch: async () => streamerProfileSchema.parse((await api.put(STREAMERS_PATHS.profile, input, WITH_SESSION)).data)
  });

export const getStreamerBySlug = (slug: string): Promise<StreamerProfile> =>
  fromSource({
    mock: () => streamerProfileSchema.parse(mockStreamers.bySlug(slug)),
    fetch: async () => streamerProfileSchema.parse((await api.get(STREAMERS_PATHS.bySlug(slug))).data)
  });

export const getOverlays = (): Promise<Overlay[]> =>
  fromSource({
    mock: () => overlayListSchema.parse(mockStreamers.overlays()),
    fetch: async () => overlayListSchema.parse((await api.get(STREAMERS_PATHS.overlays, WITH_SESSION)).data)
  });

export const createOverlay = (input: CreateOverlayInput): Promise<Overlay> =>
  fromSource({
    mock: () => overlaySchema.parse(mockStreamers.createOverlay(input)),
    fetch: async () => overlaySchema.parse((await api.post(STREAMERS_PATHS.overlays, input, WITH_SESSION)).data)
  });

export const updateOverlay = ({ id, ...patch }: UpdateOverlayInput): Promise<Overlay> =>
  fromSource({
    mock: () => overlaySchema.parse(mockStreamers.updateOverlay({ id, ...patch })),
    fetch: async () => overlaySchema.parse((await api.patch(STREAMERS_PATHS.overlay(id), patch, WITH_SESSION)).data)
  });

export const removeOverlay = (id: string): Promise<void> =>
  fromSource({
    mock: () => mockStreamers.removeOverlay(id),
    fetch: async () => {
      await api.delete(STREAMERS_PATHS.overlay(id), WITH_SESSION);
    }
  });

export const getChallenges = (): Promise<StreamerChallenge[]> =>
  fromSource({
    mock: () => challengeListSchema.parse(mockStreamers.challenges()),
    fetch: async () => challengeListSchema.parse((await api.get(STREAMERS_PATHS.challenges, WITH_SESSION)).data)
  });

export const createChallenge = (input: CreateChallengeInput): Promise<StreamerChallenge> =>
  fromSource({
    mock: () => streamerChallengeSchema.parse(mockStreamers.createChallenge(input)),
    fetch: async () => streamerChallengeSchema.parse((await api.post(STREAMERS_PATHS.challenges, input, WITH_SESSION)).data)
  });

export const activateChallenge = ({ id, donorName }: ActivateChallengeInput): Promise<StreamerChallenge> =>
  fromSource({
    mock: () => streamerChallengeSchema.parse(mockStreamers.activateChallenge({ id, donorName })),
    fetch: async () => streamerChallengeSchema.parse((await api.post(STREAMERS_PATHS.activate(id), { donorName }, WITH_SESSION)).data)
  });

export const cancelChallenge = (id: string): Promise<StreamerChallenge> =>
  fromSource({
    mock: () => streamerChallengeSchema.parse(mockStreamers.cancelChallenge(id)),
    fetch: async () => streamerChallengeSchema.parse((await api.post(STREAMERS_PATHS.cancel(id), {}, WITH_SESSION)).data)
  });

export const getIntegrations = (): Promise<StreamerIntegration[]> =>
  fromSource({
    mock: () => integrationListSchema.parse(mockStreamers.integrations()),
    fetch: async () => integrationListSchema.parse((await api.get(STREAMERS_PATHS.integrations, WITH_SESSION)).data)
  });

export const connectIntegration = (provider: ConnectableProvider): Promise<string> =>
  fromSource({
    mock: () => connectUrlSchema.parse(mockStreamers.connectUrl(provider)).url,
    fetch: async () => connectUrlSchema.parse((await api.post(STREAMERS_PATHS.connect(provider), {}, WITH_SESSION)).data).url
  });

export const disconnectIntegration = (provider: ConnectableProvider): Promise<void> =>
  fromSource({
    mock: () => mockStreamers.disconnect(provider),
    fetch: async () => {
      await api.delete(STREAMERS_PATHS.integration(provider), WITH_SESSION);
    }
  });

export const getOverlayData = (publicId: string): Promise<OverlayData> =>
  fromSource({
    mock: () => overlayDataSchema.parse(mockStreamers.overlayData(publicId)),
    fetch: async () => overlayDataSchema.parse((await api.get(STREAMERS_PATHS.overlayData(publicId))).data)
  });
