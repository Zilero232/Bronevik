import type { ApiUsageQuery, UpdateWebhookEndpointInput } from '@bronevik/schemas';
import type { z } from 'zod';

import type { openApiDocumentSchema, openApiOperationSchema, openApiParameterSchema } from './developer.schemas';

export type OpenApiDocument = z.infer<typeof openApiDocumentSchema>;
export type OpenApiOperation = z.infer<typeof openApiOperationSchema>;
export type OpenApiParameter = z.infer<typeof openApiParameterSchema>;

export type ApiKeyUsageInput = Partial<ApiUsageQuery> & {
  id: string;
};

export type UpdateWebhookInput = UpdateWebhookEndpointInput & {
  id: string;
};
