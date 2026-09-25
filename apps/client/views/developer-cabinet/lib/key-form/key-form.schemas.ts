import { createApiKeySchema } from '@bronevik/schemas';
import { z } from 'zod';

import { KEY_EXPIRY } from './key-form.constants';

export const createKeyFormSchema = createApiKeySchema.pick({ name: true }).extend({ expiry: z.enum(KEY_EXPIRY.options) });
