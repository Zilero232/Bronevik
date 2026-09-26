import { isAxiosError } from 'axios';

import { HTTP_STATUS } from './source.constants';
import { NotFoundError, UnauthorizedError } from './source.errors';

const normalizeError = (error: unknown) => {
  if (!isAxiosError(error)) {
    return error;
  }

  if (error.response?.status === HTTP_STATUS.notFound) {
    return new NotFoundError(error.message);
  }

  if (error.response?.status === HTTP_STATUS.unauthorized) {
    return new UnauthorizedError(error.message);
  }

  return error;
};

export const fromServer = async <T>(fetch: () => Promise<T>): Promise<T> => {
  try {
    return await fetch();
  } catch (error) {
    throw normalizeError(error);
  }
};

export const fromSdk = <T>(request: () => Promise<{ data: T }>): Promise<T> => fromServer(async () => (await request()).data);

export const isNotFoundError = (error: unknown): error is NotFoundError => error instanceof NotFoundError;

export const isUnauthorizedError = (error: unknown): error is UnauthorizedError => error instanceof UnauthorizedError;
