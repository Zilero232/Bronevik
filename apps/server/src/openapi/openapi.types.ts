import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject, ReferenceObject, SchemaObject, SwaggerDocumentOptions } from '@nestjs/swagger';

import type { OPENAPI } from './openapi.constants';

export type PublicDocumentInput = {
  app: INestApplication;
  include: NonNullable<SwaggerDocumentOptions['include']>;
};

export type SetupDocsInput = PublicDocumentInput & {
  internal: boolean;
};

export type RepairNullableInput = {
  document: OpenAPIObject;
  version: (typeof OPENAPI.versions)[keyof typeof OPENAPI.versions];
};

export type OpenApiSchema = ReferenceObject | SchemaObject;

export type RepairPropertyInput = {
  property: OpenApiSchema;
  version: RepairNullableInput['version'];
};
