import { nicknameSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const nicknameFormSchema = z.object({ nickname: nicknameSchema });
