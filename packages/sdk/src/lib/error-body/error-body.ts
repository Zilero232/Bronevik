import type { BeforeErrorState } from 'ky';

import { isHTTPError } from 'ky';

const bodyOf = (data: unknown): string | null => {
  if (data === undefined) {
    return null;
  }

  return typeof data === 'string' ? data : JSON.stringify(data);
};

export const restoreErrorBody = ({ error }: BeforeErrorState): Error => {
  if (!isHTTPError(error)) {
    return error;
  }

  const { status, statusText, headers } = error.response;

  error.response = new Response(bodyOf(error.data), { status, statusText, headers });

  return error;
};
