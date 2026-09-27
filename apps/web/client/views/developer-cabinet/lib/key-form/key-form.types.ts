import type { z } from 'zod';

import type { KEY_EXPIRY } from '../../config';
import type { createKeyFormSchema } from './key-form.schemas';

export type KeyExpiry = (typeof KEY_EXPIRY.options)[number];

export type CreateKeyFormValues = z.infer<typeof createKeyFormSchema>;

export type ExpiryToIsoInput = {
  expiry: KeyExpiry;
  now: Date;
};

export type ToCreateApiKeyInput = CreateKeyFormValues & {
  now: Date;
};
