import { z } from 'zod';

import type { ManagerErrorCode, ManagerErrorInit } from './manager-error.types';

import { managerErrorCodeSchema, managerErrorPayloadSchema } from './manager-error.schemas';

export class ManagerError extends Error {
  readonly code: ManagerErrorCode;

  constructor({ code, message }: ManagerErrorInit) {
    super(message);
    this.name = 'ManagerError';
    this.code = code;
  }
}

export const toManagerError = (error: unknown): ManagerError => {
  if (error instanceof ManagerError) {
    return error;
  }

  if (error instanceof z.ZodError) {
    return new ManagerError({ code: 'contract', message: error.message });
  }

  const payload = managerErrorPayloadSchema.safeParse(error);

  if (payload.success) {
    const code = managerErrorCodeSchema.catch('unknown').parse(payload.data.code);

    return new ManagerError({ code, message: payload.data.message });
  }

  return new ManagerError({ code: 'unknown', message: error instanceof Error ? error.message : String(error) });
};
