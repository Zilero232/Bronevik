import { WEBHOOK, webhookPayloadSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { WEBHOOK_EXAMPLES } from '../webhook-examples.constants';

describe('WEBHOOK_EXAMPLES', () => {
  it('documents every event the server emits', () => {
    expect(Object.keys(WEBHOOK_EXAMPLES).sort()).toEqual([...WEBHOOK.events].sort());
  });

  it('shows payloads that pass the delivery contract under their own event name', () => {
    Object.entries(WEBHOOK_EXAMPLES).forEach(([event, payload]) => {
      expect(webhookPayloadSchema.safeParse(payload).success).toBe(true);
      expect(payload.event).toBe(event);
    });
  });
});
