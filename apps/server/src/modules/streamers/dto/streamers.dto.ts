import {
  activateChallengeSchema,
  adminClaimListSchema,
  applyRequestSchema,
  challengeListSchema,
  connectUrlSchema,
  createApplyRequestSchema,
  createChallengeSchema,
  createOverlaySchema,
  editorialStreamerSchema,
  followStreamerSchema,
  integrationListSchema,
  modApplyListSchema,
  overlayDataSchema,
  overlayListSchema,
  overlaySchema,
  previewOverlaySchema,
  removalRequestSchema,
  resolveClaimSchema,
  saveStreamerSettingsSchema,
  settingsAggregatesQuerySchema,
  settingsAggregatesSchema,
  settingsCompareQuerySchema,
  settingsCompareSchema,
  settingsHistorySchema,
  settingsShareSchema,
  settingsTableSchema,
  startClaimSchema,
  streamerChallengeSchema,
  streamerClaimSchema,
  streamerDirectoryQuerySchema,
  streamerDirectorySchema,
  streamerFollowListSchema,
  streamerInvitationListSchema,
  streamerLiveListSchema,
  streamerProfileSchema,
  streamerSettingsViewSchema,
  updateOverlaySchema,
  updateSettingsShareSchema,
  upsertStreamerProfileSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import {
  applyListSchema,
  claimStatusResponseSchema,
  connectProviderSchema,
  idParamsSchema,
  oauthCallbackSchema,
  overlayParamsSchema,
  settingsShareResponseSchema,
  slugParamsSchema
} from './streamers.schemas';

export class StreamerProfileDto extends createZodDto(streamerProfileSchema) {}
export class UpsertProfileDto extends createZodDto(upsertStreamerProfileSchema) {}
export class SlugParamsDto extends createZodDto(slugParamsSchema) {}
export class OverlayDto extends createZodDto(overlaySchema) {}
export class OverlayListDto extends createZodDto(overlayListSchema) {}
export class CreateOverlayDto extends createZodDto(createOverlaySchema) {}
export class UpdateOverlayDto extends createZodDto(updateOverlaySchema) {}
export class PreviewOverlayDto extends createZodDto(previewOverlaySchema) {}
export class IdParamsDto extends createZodDto(idParamsSchema) {}
export class OverlayParamsDto extends createZodDto(overlayParamsSchema) {}
export class OverlayDataDto extends createZodDto(overlayDataSchema) {}
export class StreamerChallengeDto extends createZodDto(streamerChallengeSchema) {}
export class ChallengeListDto extends createZodDto(challengeListSchema) {}
export class CreateChallengeDto extends createZodDto(createChallengeSchema) {}
export class ActivateChallengeDto extends createZodDto(activateChallengeSchema) {}
export class IntegrationListDto extends createZodDto(integrationListSchema) {}
export class ConnectProviderDto extends createZodDto(connectProviderSchema) {}
export class ConnectUrlDto extends createZodDto(connectUrlSchema) {}
export class OAuthCallbackDto extends createZodDto(oauthCallbackSchema) {}
export class StreamerDirectoryQueryDto extends createZodDto(streamerDirectoryQuerySchema) {}
export class StreamerDirectoryDto extends createZodDto(streamerDirectorySchema) {}
export class StreamerLiveListDto extends createZodDto(streamerLiveListSchema) {}
export class StartClaimDto extends createZodDto(startClaimSchema) {}
export class StreamerClaimDto extends createZodDto(streamerClaimSchema) {}
export class ClaimStatusDto extends createZodDto(claimStatusResponseSchema) {}
export class AdminClaimListDto extends createZodDto(adminClaimListSchema) {}
export class ResolveClaimDto extends createZodDto(resolveClaimSchema) {}
export class RemovalRequestDto extends createZodDto(removalRequestSchema) {}
export class EditorialStreamerDto extends createZodDto(editorialStreamerSchema) {}
export class StreamerInvitationListDto extends createZodDto(streamerInvitationListSchema) {}
export class FollowStreamerDto extends createZodDto(followStreamerSchema) {}
export class StreamerFollowListDto extends createZodDto(streamerFollowListSchema) {}
export class StreamerSettingsViewDto extends createZodDto(streamerSettingsViewSchema) {}
export class SaveStreamerSettingsDto extends createZodDto(saveStreamerSettingsSchema) {}
export class SettingsHistoryDto extends createZodDto(settingsHistorySchema) {}
export class SettingsTableDto extends createZodDto(settingsTableSchema) {}
export class SettingsCompareQueryDto extends createZodDto(settingsCompareQuerySchema) {}
export class SettingsCompareDto extends createZodDto(settingsCompareSchema) {}
export class SettingsAggregatesQueryDto extends createZodDto(settingsAggregatesQuerySchema) {}
export class SettingsAggregatesDto extends createZodDto(settingsAggregatesSchema) {}
export class CreateApplyRequestDto extends createZodDto(createApplyRequestSchema) {}
export class ApplyRequestDto extends createZodDto(applyRequestSchema) {}
export class ApplyListDto extends createZodDto(applyListSchema) {}
export class SettingsShareDto extends createZodDto(settingsShareSchema) {}
export class SettingsShareResponseDto extends createZodDto(settingsShareResponseSchema) {}
export class UpdateSettingsShareDto extends createZodDto(updateSettingsShareSchema) {}
export class ModApplyListDto extends createZodDto(modApplyListSchema) {}
