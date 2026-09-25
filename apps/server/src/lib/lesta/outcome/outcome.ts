import { z } from 'zod';

import type { ClassifyLestaResponseInput, LestaOutcome } from './outcome.types';

import { RETRYABLE_LESTA_CODES } from '../errors';
import { LESTA_HTTP } from './outcome.constants';

const errorEnvelopeSchema = z.object({
  status: z.literal('error'),
  error: z.looseObject({ message: z.string() })
});

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

export const classifyLestaResponse = ({ status, body }: ClassifyLestaResponseInput): LestaOutcome => {
  if (status === LESTA_HTTP.tooManyRequests || status >= LESTA_HTTP.serverErrorFrom) {
    return 'degraded';
  }

  if (status >= LESTA_HTTP.clientErrorFrom) {
    return 'rejected';
  }

  const envelope = errorEnvelopeSchema.safeParse(parseJson(body));

  if (!envelope.success) {
    return 'ok';
  }

  return RETRYABLE_LESTA_CODES.has(envelope.data.error.message) ? 'degraded' : 'rejected';
};
