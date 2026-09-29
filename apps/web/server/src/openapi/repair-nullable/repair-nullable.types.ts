import type { OpenAPIObject, ReferenceObject, SchemaObject } from '@nestjs/swagger';

import type { OPENAPI } from '../openapi.constants';

export type RepairNullableInput = {
  document: OpenAPIObject;
  version: (typeof OPENAPI.versions)[keyof typeof OPENAPI.versions];
};

export type OpenApiSchema = ReferenceObject | SchemaObject;

export type RepairPropertyInput = {
  property: OpenApiSchema;
  version: RepairNullableInput['version'];
};
