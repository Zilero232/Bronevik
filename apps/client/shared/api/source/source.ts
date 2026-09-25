import { isAxiosError } from 'axios';

import { env } from '@/shared/config/client-env';

import type { FromSourceInput } from './source.types';

import { MOCK_SOURCE } from './source.constants';
import { NotFoundError, UnauthorizedError } from './source.errors';

const HTTP_STATUS = {
  unauthorized: 401,
  notFound: 404
} as const;

const mockDelay = (signal?: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, MOCK_SOURCE.latencyMs + Math.random() * MOCK_SOURCE.jitterMs);

    signal?.addEventListener('abort', () => clearTimeout(timer), { once: true });
  });

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

export const fromSource = async <T>({ mock, fetch, signal }: FromSourceInput<T>): Promise<T> => {
  if (env.NEXT_PUBLIC_USE_MOCKS) {
    await mockDelay(signal);

    return mock();
  }

  try {
    return await fetch();
  } catch (error) {
    throw normalizeError(error);
  }
};

export const isNotFoundError = (error: unknown): error is NotFoundError => error instanceof NotFoundError;

export const isUnauthorizedError = (error: unknown): error is UnauthorizedError => error instanceof UnauthorizedError;
