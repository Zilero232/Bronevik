import type { z } from 'zod';

import type { NICKNAME_ERROR_KINDS } from '../../config';
import type { nicknameFormSchema } from './nickname-form.schemas';

export type NicknameFormValues = z.infer<typeof nicknameFormSchema>;

export type NicknameErrorKind = (typeof NICKNAME_ERROR_KINDS)[number];
