import {
  apiErrorLogSchema,
  apiErrorSchema,
  apiKeySchema,
  apiKeysSchema,
  apiUsageQuerySchema,
  apiUsageSchema,
  createApiKeySchema,
  createdApiKeySchema,
  createdWebhookEndpointSchema,
  createWebhookEndpointSchema,
  developerOverviewSchema,
  updateWebhookEndpointSchema,
  uuidSchema,
  webhookDeliveriesSchema,
  webhookEndpointSchema,
  webhookEndpointsSchema
} from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class DeveloperIdParamsDto extends createZodDto(z.object({ id: uuidSchema })) {}
export class DeveloperOverviewDto extends createZodDto(developerOverviewSchema) {}
export class ApiKeyDto extends createZodDto(apiKeySchema) {}
export class ApiKeysDto extends createZodDto(apiKeysSchema) {}
export class CreateApiKeyDto extends createZodDto(createApiKeySchema) {}
export class CreatedApiKeyDto extends createZodDto(createdApiKeySchema) {}
export class ApiUsageQueryDto extends createZodDto(apiUsageQuerySchema) {}
export class ApiUsageDto extends createZodDto(apiUsageSchema) {}
export class ApiErrorLogDto extends createZodDto(apiErrorLogSchema) {}
export class WebhookEndpointDto extends createZodDto(webhookEndpointSchema) {}
export class WebhookEndpointsDto extends createZodDto(webhookEndpointsSchema) {}
export class CreateWebhookEndpointDto extends createZodDto(createWebhookEndpointSchema) {}
export class UpdateWebhookEndpointDto extends createZodDto(updateWebhookEndpointSchema) {}
export class CreatedWebhookEndpointDto extends createZodDto(createdWebhookEndpointSchema) {}
export class WebhookDeliveriesDto extends createZodDto(webhookDeliveriesSchema) {}
export class ApiErrorDto extends createZodDto(apiErrorSchema) {}
