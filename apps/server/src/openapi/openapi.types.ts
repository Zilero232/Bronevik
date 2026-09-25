import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';

export type PickPathsInput = {
  document: OpenAPIObject;
  prefix: string;
};

export type ReachableSchemasInput = {
  schemas: NonNullable<NonNullable<OpenAPIObject['components']>['schemas']>;
  paths: OpenAPIObject['paths'];
};

export type SetupDocsInput = {
  app: INestApplication;
  internal: boolean;
};
