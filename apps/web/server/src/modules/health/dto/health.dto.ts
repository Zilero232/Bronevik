import { healthSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class HealthDto extends createZodDto(healthSchema) {}
