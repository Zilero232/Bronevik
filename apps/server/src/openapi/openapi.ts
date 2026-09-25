import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import type { SetupDocsInput } from './openapi.types';

import { OPENAPI } from './openapi.constants';
import { pickPaths } from './pick-paths';

export const internalDocument = (app: INestApplication): OpenAPIObject => {
  const config = new DocumentBuilder()
    .setTitle(OPENAPI.internal.title)
    .setDescription(OPENAPI.internal.description)
    .setVersion(OPENAPI.version)
    .addBearerAuth()
    .addCookieAuth(OPENAPI.internal.sessionCookie)
    .addApiKey({ type: 'apiKey', in: 'header', name: OPENAPI.public.apiKeyHeader }, OPENAPI.public.securityName)
    .build();

  return cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));
};

export const publicDocument = (app: INestApplication): OpenAPIObject => {
  const config = new DocumentBuilder()
    .setTitle(OPENAPI.public.title)
    .setDescription(OPENAPI.public.description)
    .setVersion(OPENAPI.version)
    .addApiKey({ type: 'apiKey', in: 'header', name: OPENAPI.public.apiKeyHeader }, OPENAPI.public.securityName)
    .build();

  return pickPaths({ document: cleanupOpenApiDoc(SwaggerModule.createDocument(app, config)), prefix: OPENAPI.public.prefix });
};

export const setupDocs = ({ app, internal }: SetupDocsInput): void => {
  if (internal) {
    SwaggerModule.setup(OPENAPI.internal.path, app, internalDocument(app));
  }

  SwaggerModule.setup(OPENAPI.public.path, app, publicDocument(app), { jsonDocumentUrl: `${OPENAPI.public.path}/openapi.json` });
};
