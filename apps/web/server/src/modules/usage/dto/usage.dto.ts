import { usageSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class UsageDto extends createZodDto(usageSchema) {}
