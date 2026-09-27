import { z } from 'zod';

import { MANAGER_ERROR_CODES } from './manager-error.constants';

export const managerErrorCodeSchema = z.enum(MANAGER_ERROR_CODES);

export const managerErrorPayloadSchema = z.object({
  code: z.string(),
  message: z.string()
});
