import { techTreeParamsSchema, techTreeSchema } from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';

export class TechTreeParamsDto extends createZodDto(techTreeParamsSchema) {}
export class TechTreeDto extends createZodDto(techTreeSchema) {}
