import type { NextFunction, Request, Response } from 'express';

import helmet from 'helmet';

import { API_HELMET } from './api-helmet.constants';

const strict = helmet({ crossOriginResourcePolicy: API_HELMET.crossOriginResourcePolicy });
const documentation = helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: API_HELMET.crossOriginResourcePolicy });

export const isDocumentationPath = (path: string): boolean =>
  API_HELMET.documentationPaths.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

export const apiHelmet = (request: Request, response: Response, next: NextFunction): void => {
  (isDocumentationPath(request.path) ? documentation : strict)(request, response, next);
};
