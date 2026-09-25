import type { createChallengeSchema } from '@bronevik/schemas';
import type { z } from 'zod';

import type { CreateOverlayInput } from '@/shared/api/streamers';

export type SaveOverlayInput = {
  id: string | null;
  values: CreateOverlayInput;
};

export type ChallengeFormValues = z.input<typeof createChallengeSchema>;

export type ChallengeFormOutput = z.output<typeof createChallengeSchema>;
