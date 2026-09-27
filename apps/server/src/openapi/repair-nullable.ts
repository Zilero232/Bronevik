import type { OpenAPIObject, SchemaObject } from '@nestjs/swagger';

import { mapValues } from 'remeda';

import type { OpenApiSchema, RepairNullableInput, RepairPropertyInput } from './openapi.types';

import { OPENAPI } from './openapi.constants';

const isBrokenNullable = (schema: OpenApiSchema): schema is SchemaObject & { items: OpenApiSchema } =>
  !('$ref' in schema) && Reflect.get(schema, OPENAPI.emptyTypeKey) === true && schema.type === 'array' && schema.items !== undefined;

const repairProperty = ({ property, version }: RepairPropertyInput): OpenApiSchema => {
  if (!isBrokenNullable(property)) {
    return property;
  }

  const { type: _type, items, ...rest } = property;

  return version === OPENAPI.versions.v31 ? { ...rest, anyOf: [items, { type: 'null' }] } : { ...rest, ...items, nullable: true };
};

export const repairNullable = ({ document, version }: RepairNullableInput): OpenAPIObject => ({
  ...document,
  components: {
    ...document.components,
    schemas: mapValues(document.components?.schemas ?? {}, (schema) =>
      '$ref' in schema || !schema.properties
        ? schema
        : { ...schema, properties: mapValues(schema.properties, (property) => repairProperty({ property, version })) }
    )
  }
});
