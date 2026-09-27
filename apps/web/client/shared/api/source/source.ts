import { apiErrorSchema } from '@otmetki/schemas';
import { isAxiosError } from 'axios';
import { isIncludedIn } from 'remeda';

import { NotFoundError, PlusRequiredError, UnauthorizedError } from './errors';
import { HTTP_STATUS, PLUS_REQUIRED_CODES } from './source.constants';

const plusRequiredOf = (body: unknown): PlusRequiredError | null => {
  const parsed = apiErrorSchema.safeParse(body);

  if (!parsed.success || !isIncludedIn(parsed.data.code, PLUS_REQUIRED_CODES)) {
    return null;
  }

  return new PlusRequiredError({ code: parsed.data.code, details: parsed.data.details ?? {}, message: parsed.data.error });
};

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

  return plusRequiredOf(error.response?.data) ?? error;
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

export const isPlusRequiredError = (error: unknown): error is PlusRequiredError => error instanceof PlusRequiredError;
