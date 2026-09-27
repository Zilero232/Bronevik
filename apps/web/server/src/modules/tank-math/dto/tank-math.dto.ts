import { createZodDto } from 'nestjs-zod';

import { tankMathParamsSchema, tankMathSchema } from './tank-math.schemas';

export class TankMathDto extends createZodDto(tankMathSchema) {}

export class TankMathParamsDto extends createZodDto(tankMathParamsSchema) {}
