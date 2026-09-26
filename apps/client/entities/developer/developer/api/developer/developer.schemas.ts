import { z } from 'zod';

export const openApiParameterSchema = z.object({
  name: z.string(),
  in: z.enum(['path', 'query', 'header', 'cookie']),
  required: z.boolean().optional(),
  description: z.string().optional(),
  schema: z
    .object({ type: z.string().optional(), enum: z.array(z.unknown()).optional() })
    .loose()
    .optional()
});

export const openApiOperationSchema = z
  .object({
    operationId: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    parameters: z.array(openApiParameterSchema).optional(),
    responses: z.record(z.string(), z.object({ description: z.string().optional() }).loose()).optional()
  })
  .loose();

export const openApiDocumentSchema = z
  .object({
    openapi: z.string(),
    info: z.object({ title: z.string(), version: z.string(), description: z.string().optional() }).loose(),
    paths: z.record(z.string(), z.record(z.string(), z.unknown()))
  })
  .loose();
