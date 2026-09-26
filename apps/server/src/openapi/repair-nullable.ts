import type { OpenAPIObject, ReferenceObject, SchemaObject } from '@nestjs/swagger';

import { mapValues } from 'remeda';

import type { RepairNullableInput } from './openapi.types';

import { OPENAPI } from './openapi.constants';

type Schema = ReferenceObject | SchemaObject;

const isBrokenNullable = (schema: Schema): schema is SchemaObject & { items: Schema } =>
  !('$ref' in schema) && Reflect.get(schema, OPENAPI.emptyTypeKey) === true && schema.type === 'array' && schema.items !== undefined;

const repairProperty = (property: Schema, version: RepairNullableInput['version']): Schema => {
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
        : { ...schema, properties: mapValues(schema.properties, (property) => repairProperty(property, version)) }
    )
  }
});
