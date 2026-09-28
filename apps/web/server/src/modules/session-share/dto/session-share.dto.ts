import {
  modSessionSharePreferenceAnswerSchema,
  modSessionSharePreferenceSchema,
  modSessionShareSendSchema,
  modSessionShareSentSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class ModSessionSharePreferenceDto extends createZodDto(modSessionSharePreferenceSchema) {}
export class ModSessionSharePreferenceAnswerDto extends createZodDto(modSessionSharePreferenceAnswerSchema) {}
export class ModSessionShareSendDto extends createZodDto(modSessionShareSendSchema) {}
export class ModSessionShareSentDto extends createZodDto(modSessionShareSentSchema) {}
