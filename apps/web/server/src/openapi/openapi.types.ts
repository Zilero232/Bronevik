import type { INestApplication } from '@nestjs/common';
import type { SwaggerDocumentOptions } from '@nestjs/swagger';

export type PublicDocumentInput = {
  app: INestApplication;
  include: NonNullable<SwaggerDocumentOptions['include']>;
};

export type SetupDocsInput = PublicDocumentInput & {
  internal: boolean;
};
