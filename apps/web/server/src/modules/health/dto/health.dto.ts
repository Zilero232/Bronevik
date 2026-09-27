import { createZodDto } from 'nestjs-zod';

import { healthSchema } from './health.schemas';

export class HealthDto extends createZodDto(healthSchema) {}
