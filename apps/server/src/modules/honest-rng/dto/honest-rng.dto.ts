import { createZodDto } from 'nestjs-zod';

import { honestRngMineSchema, honestRngSchema, rngQuerySchema } from './honest-rng.schemas';

export class HonestRngDto extends createZodDto(honestRngSchema) {}

export class HonestRngMineDto extends createZodDto(honestRngMineSchema) {}

export class RngQueryDto extends createZodDto(rngQuerySchema) {}
