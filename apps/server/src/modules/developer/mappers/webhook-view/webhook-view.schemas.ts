import { z } from 'zod';

import { WEBHOOK_DB_EVENTS } from '../../config';

export const webhookDbEventSchema = z.enum(WEBHOOK_DB_EVENTS);
