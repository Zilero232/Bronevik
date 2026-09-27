import type { z } from 'zod';

import type { managerErrorCodeSchema, managerErrorPayloadSchema } from './manager-error.schemas';

export type ManagerErrorCode = z.infer<typeof managerErrorCodeSchema>;

export type ManagerErrorPayload = z.infer<typeof managerErrorPayloadSchema>;

export type ManagerErrorInit = {
  code: ManagerErrorCode;
  message: string;
};
