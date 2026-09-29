import {
  apiErrorLogSchema,
  apiKeysSchema,
  apiTiersSchema,
  apiUsageQuerySchema,
  apiUsageSchema,
  createApiKeySchema,
  createdApiKeySchema,
  createdWebhookEndpointSchema,
  createWebhookEndpointSchema,
  developerOverviewSchema,
  updateWebhookEndpointSchema,
  webhookDeliveriesSchema,
  webhookEndpointSchema,
  webhookEndpointsSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { developerIdParamsSchema } from './developer.schemas';

export class DeveloperIdParamsDto extends createZodDto(developerIdParamsSchema) {}
export class ApiTiersDto extends createZodDto(apiTiersSchema) {}
export class DeveloperOverviewDto extends createZodDto(developerOverviewSchema) {}
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
