import type { z } from 'zod';

import type { manualClaimSchema } from './claim-form';

export type ManualClaimValues = z.infer<typeof manualClaimSchema>;
