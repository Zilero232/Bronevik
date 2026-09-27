import { createZodDto } from 'nestjs-zod';

import { pulseSchema } from './pulse.schemas';

export class PulseDto extends createZodDto(pulseSchema) {}
