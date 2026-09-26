import { notificationEventSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { INBOX_EVENT } from '../inbox-event.constants';

describe('INBOX_EVENT', () => {
  it('gives every notification event an icon and a tone', () => {
    notificationEventSchema.options.forEach((event) => {
      expect(INBOX_EVENT[event].icon).toBeDefined();
      expect(INBOX_EVENT[event].tone).toEqual(expect.any(String));
    });
  });

  it('describes no event the contract does not know', () => {
    expect(Object.keys(INBOX_EVENT).sort()).toEqual([...notificationEventSchema.options].sort());
  });
});
