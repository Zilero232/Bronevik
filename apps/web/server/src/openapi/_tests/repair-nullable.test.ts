import type { OpenAPIObject, ReferenceObject, SchemaObject } from '@nestjs/swagger';

import { describe, expect, it } from 'vitest';

import { OPENAPI } from '../openapi.constants';
import { repairNullable } from '../repair-nullable';

const documentWith = (properties: Record<string, ReferenceObject | SchemaObject>): OpenAPIObject => ({
  openapi: '3.0.0',
  info: { title: 'test', version: '0' },
  paths: {},
  components: { schemas: { Dto: { type: 'object', properties } } }
});

const broken = { [OPENAPI.emptyTypeKey]: true, type: 'array', items: { type: 'string' } };

describe('repairNullable', () => {
  it('turns a nullable primitive that swagger read as an array into an OpenAPI 3.0 nullable value', () => {
    const repaired = repairNullable({ document: documentWith({ bio: broken }), version: OPENAPI.versions.v30 });

    expect(repaired.components?.schemas?.Dto).toEqual({
      type: 'object',
      properties: { bio: { [OPENAPI.emptyTypeKey]: true, type: 'string', nullable: true } }
    });
  });

  it('turns it into an anyOf with null for OpenAPI 3.1', () => {
    const repaired = repairNullable({ document: documentWith({ bio: broken }), version: OPENAPI.versions.v31 });

    expect(repaired.components?.schemas?.Dto).toEqual({
      type: 'object',
      properties: { bio: { [OPENAPI.emptyTypeKey]: true, anyOf: [{ type: 'string' }, { type: 'null' }] } }
    });
  });

  it('leaves real arrays alone', () => {
    const document = documentWith({ tags: { type: 'array', items: { type: 'string' } } });

    expect(repairNullable({ document, version: OPENAPI.versions.v30 })).toEqual(document);
  });
});
