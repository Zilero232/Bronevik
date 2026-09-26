import type { createChallengeSchema } from '@otmetki/schemas';
import type { z } from 'zod';

import type { CreateOverlayInput } from '@/entities/streamer/streamer';

export type SaveOverlayInput = {
  id: string | null;
  values: CreateOverlayInput;
};

export type ChallengeFormValues = z.input<typeof createChallengeSchema>;

export type ChallengeFormOutput = z.output<typeof createChallengeSchema>;
