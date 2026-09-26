import {
  activateChallengeSchema,
  challengeListSchema,
  connectUrlSchema,
  createChallengeSchema,
  createOverlaySchema,
  integrationListSchema,
  overlayDataSchema,
  overlayListSchema,
  overlaySchema,
  previewOverlaySchema,
  streamerChallengeSchema,
  streamerProfileSchema,
  updateOverlaySchema,
  upsertStreamerProfileSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { connectProviderSchema, idParamsSchema, oauthCallbackSchema, overlayParamsSchema, slugParamsSchema } from './streamers.schemas';

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
