import type { AuthResult } from '../source.types';

import { NotFoundError, UnauthorizedError } from '../errors';
import { HTTP_STATUS } from '../source.constants';

export const fromAuth = async <T>(request: Promise<AuthResult<T>>): Promise<T | null> => {
  const { data, error } = await request;

  if (!error) {
    return data;
  }

  if (error.status === HTTP_STATUS.notFound) {
    throw new NotFoundError(error.message);
  }

  if (error.status === HTTP_STATUS.unauthorized) {
    throw new UnauthorizedError(error.message);
  }

  throw new Error(error.message ?? `Auth request failed with ${error.status}`);
};
