import type { z } from 'zod';

import type { deleteAccountFormSchema } from './delete-account';

export type DeleteAccountFormValues = z.input<ReturnType<typeof deleteAccountFormSchema>>;
